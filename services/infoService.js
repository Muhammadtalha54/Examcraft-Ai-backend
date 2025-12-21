// Get privacy policy content
const getPrivacyPolicy = () => {
  return {
    title: "Privacy Policy",
    content: `
      <h2>Privacy Policy for ExamCraft AI</h2>
      <p>Last updated: ${new Date().toDateString()}</p>
      
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, upload files, or contact us.</p>
      
      <h3>How We Use Your Information</h3>
      <p>We use the information we collect to provide, maintain, and improve our services.</p>
      
      <h3>Information Sharing</h3>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
      
      <h3>Data Security</h3>
      <p>We implement appropriate security measures to protect your personal information.</p>
      
      <h3>Contact Us</h3>
      <p>If you have questions about this Privacy Policy, please contact us.</p>
    `
  };
};

// Get terms and conditions content
const getTermsAndConditions = () => {
  return {
    title: "Terms and Conditions",
    content: `
      <h2>Terms and Conditions for ExamCraft AI</h2>
      <p>Last updated: ${new Date().toDateString()}</p>
      
      <h3>Acceptance of Terms</h3>
      <p>By accessing and using ExamCraft AI, you accept and agree to be bound by these terms.</p>
      
      <h3>Use License</h3>
      <p>Permission is granted to temporarily use ExamCraft AI for personal, non-commercial use only.</p>
      
      <h3>Disclaimer</h3>
      <p>The materials on ExamCraft AI are provided on an 'as is' basis.</p>
      
      <h3>Limitations</h3>
      <p>In no event shall ExamCraft AI be liable for any damages arising out of the use of this service.</p>
      
      <h3>Modifications</h3>
      <p>ExamCraft AI may revise these terms at any time without notice.</p>
    `
  };
};

module.exports = {
  getPrivacyPolicy,
  getTermsAndConditions
};