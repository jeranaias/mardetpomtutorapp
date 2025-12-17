# Security Policy

## Classification

**UNCLASSIFIED**

This repository contains documentation and code templates for an unclassified tutoring management system. No classified information, operational security data, or sensitive credentials are stored in this repository.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. **Email** the security concern to the project maintainers
3. **Include** the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Assessment**: Initial assessment within 5 business days
- **Resolution**: Depending on severity, fixes will be prioritized accordingly
- **Credit**: Security researchers will be credited (if desired) when the vulnerability is disclosed

### Scope

This security policy covers:
- Documentation templates in this repository
- React source code for the public site
- PowerFx formulas and DAX queries
- Configuration examples

This policy does **NOT** cover:
- Microsoft 365 platform vulnerabilities (report to Microsoft)
- SharePoint Online vulnerabilities (report to Microsoft)
- Power Platform vulnerabilities (report to Microsoft)

## Security Best Practices

When implementing this system, follow these security guidelines:

### Authentication
- Use Azure AD authentication with MFA (dliflc.edu accounts)
- Enforce MFA for all users
- Use security groups for access control
- Implement least-privilege access

### Data Protection
- Never store classified information in this system
- Minimize PII collection to what's necessary
- Use SharePoint's built-in encryption
- Enable audit logging

### Configuration
- Use service accounts for Power Automate flows
- Restrict app sharing to authorized users
- Configure row-level security in Power BI
- Review permissions quarterly

### Secrets Management
- Never commit credentials to the repository
- Use environment variables for configuration
- Rotate service account passwords annually
- Document all service accounts

## Compliance

This system is designed to comply with:
- DoD Instruction 8500.01 (Cybersecurity)
- FISMA Low Impact baseline
- Privacy Act of 1974
- NIST SP 800-53 controls (as applicable)

For detailed compliance information, see [docs/06-approval/CYBERSECURITY_PACKAGE.md](docs/06-approval/CYBERSECURITY_PACKAGE.md).

## Security Contacts

For security concerns related to:

- **This Repository**: Create a private security advisory on GitHub
- **DLIFLC Systems**: Contact helpdesk@dliflc.edu
- **Microsoft 365**: Use Microsoft's security response center

## Acknowledgments

We appreciate the security research community's efforts to improve the security of open source projects. Responsible disclosure helps protect users and improve our systems.

---

**Last Updated:** December 2025
**Classification:** UNCLASSIFIED
