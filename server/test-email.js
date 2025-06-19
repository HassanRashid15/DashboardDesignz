require("dotenv").config();
const {
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require("./utils/emailService");

async function testEmailService() {
  console.log("Testing email service...");

  const testEmail = "test@example.com";
  const testToken = "test-token-123";
  const testName = "Test User";

  try {
    // Test email verification
    console.log("Testing email verification...");
    const verificationResult = await sendEmailVerification(
      testEmail,
      testToken,
      testName
    );
    console.log("Email verification result:", verificationResult);

    // Test password reset
    console.log("Testing password reset...");
    const resetResult = await sendPasswordResetEmail(
      testEmail,
      testToken,
      testName
    );
    console.log("Password reset result:", resetResult);

    // Test welcome email
    console.log("Testing welcome email...");
    const welcomeResult = await sendWelcomeEmail(testEmail, testName);
    console.log("Welcome email result:", welcomeResult);
  } catch (error) {
    console.error("Email test failed:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testEmailService();
}

module.exports = { testEmailService };
