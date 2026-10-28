package com.SkillNest.SkillNest.service;

import com.SkillNest.SkillNest.entity.TestAttempt;
import com.SkillNest.SkillNest.repo.TestAttemptRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    private final TestAttemptRepository testAttemptRepository;

    public EmailService(TestAttemptRepository testAttemptRepository) {
        this.testAttemptRepository = testAttemptRepository;
    }

    public void sendTestResultEmail(TestAttempt attempt) {
        if (attempt == null || attempt.getStudent() == null || attempt.getStudent().getEmail() == null) {
            return;
        }

        String recipientEmail = attempt.getStudent().getEmail();

        // Check if SMTP configuration is provided
        if (mailSender == null || mailUsername == null || mailUsername.trim().isEmpty()) {
            logger.info("SMTP configuration not provided (SPRING_MAIL_USERNAME is empty). Email delivery skipped for student: {}", recipientEmail);
            attempt.setEmailStatus("NOT_CONFIGURED");
            testAttemptRepository.save(attempt);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailUsername, "SkillNest Learning Platform");
            helper.setTo(recipientEmail);
            helper.setSubject("Test Results: " + attempt.getQuiz().getTitle() + " — " + (attempt.isPassed() ? "Passed 🎉" : "Completed"));

            String formattedDate = attempt.getSubmittedAt() != null
                    ? attempt.getSubmittedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"))
                    : "Recently";

            int minutes = attempt.getTimeTakenSeconds() / 60;
            int seconds = attempt.getTimeTakenSeconds() % 60;
            String timeTakenStr = String.format("%d min %d sec", minutes, seconds);

            String statusColor = attempt.isPassed() ? "#2E7D32" : "#C62828";
            String statusBadge = attempt.isPassed() ? "PASSED" : "NEEDS IMPROVEMENT";

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #EAE7DD; margin: 0; padding: 20px; color: #4A3A30; }
                    .card { max-width: 580px; margin: 0 auto; background: #F8F6F0; border-radius: 12px; border: 1px solid #C9B8A5; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                    .header { text-align: center; border-bottom: 2px solid #C9B8A5; padding-bottom: 20px; margin-bottom: 24px; }
                    .brand { font-size: 24px; font-weight: bold; color: #99775C; letter-spacing: 1px; }
                    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; color: #FFFFFF; background-color: %s; margin-top: 10px; }
                    .score-box { background: #EAE7DD; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .score-number { font-size: 38px; font-weight: 800; color: #99775C; line-height: 1; }
                    .stats-table { width: 100%%; border-collapse: collapse; margin-top: 16px; }
                    .stats-table td { padding: 10px 8px; border-bottom: 1px solid #EAE7DD; font-size: 14px; }
                    .stats-table td.label { color: #665544; font-weight: 500; }
                    .stats-table td.value { text-align: right; font-weight: 700; color: #4A3A30; }
                    .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #8C7866; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="header">
                      <div class="brand">SkillNest</div>
                      <h2 style="margin: 8px 0 0 0; color: #4A3A30;">Test Result Summary</h2>
                      <div class="badge">%s</div>
                    </div>

                    <p>Hi <strong>%s</strong>,</p>
                    <p>Thank you for taking the test <strong>%s</strong> on SkillNest. Here is your official performance report:</p>

                    <div class="score-box">
                      <div class="score-number">%d / %d</div>
                      <div style="font-size: 15px; font-weight: 600; margin-top: 6px; color: #4A3A30;">Score (%.1f%%)</div>
                    </div>

                    <table class="stats-table">
                      <tr>
                        <td class="label">Pass Criteria</td>
                        <td class="value">%d marks required</td>
                      </tr>
                      <tr>
                        <td class="label">Correct Answers</td>
                        <td class="value" style="color: #2E7D32;">%d</td>
                      </tr>
                      <tr>
                        <td class="label">Incorrect Answers</td>
                        <td class="value" style="color: #C62828;">%d</td>
                      </tr>
                      <tr>
                        <td class="label">Unanswered</td>
                        <td class="value">%d</td>
                      </tr>
                      <tr>
                        <td class="label">Time Taken</td>
                        <td class="value">%s</td>
                      </tr>
                      <tr>
                        <td class="label">Submitted At</td>
                        <td class="value">%s</td>
                      </tr>
                    </table>

                    <div class="footer">
                      <p>You can review detailed question solutions anytime by logging into your SkillNest dashboard.</p>
                      <p>&copy; SkillNest Learning Platform. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(
                    statusColor,
                    statusBadge,
                    attempt.getStudent().getName() != null ? attempt.getStudent().getName() : "Student",
                    attempt.getQuiz().getTitle(),
                    attempt.getScore(),
                    attempt.getTotalMarks(),
                    attempt.getPercentage(),
                    attempt.getQuiz().getPassingMarks(),
                    attempt.getCorrectCount(),
                    attempt.getIncorrectCount(),
                    attempt.getUnansweredCount(),
                    timeTakenStr,
                    formattedDate
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);

            attempt.setEmailStatus("SENT");
            testAttemptRepository.save(attempt);
            logger.info("Successfully sent test result email to {}", recipientEmail);

        } catch (Exception e) {
            logger.warn("Failed to deliver test result email to {}: {}", recipientEmail, e.getMessage());
            attempt.setEmailStatus("FAILED");
            testAttemptRepository.save(attempt);
        }
    }
}
