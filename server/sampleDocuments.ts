import { EnterpriseDocument } from '../src/types';

export const INITIAL_ENTERPRISE_DOCS: Array<{
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'json';
  department: 'Security' | 'HR' | 'Engineering' | 'Finance' | 'Legal' | 'Executive' | 'Sales';
  classification: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  author: string;
  category: string;
  summary: string;
  tags: string[];
  content: string;
}> = [
  {
    id: 'doc_soc2_security_2026',
    name: 'Enterprise_Security_Compliance_SOC2_ISO27001.pdf',
    type: 'pdf',
    department: 'Security',
    classification: 'Confidential',
    author: 'InfoSec Governance Team',
    category: 'Security Compliance',
    summary: 'Comprehensive enterprise security policies covering AES-256 encryption at rest, TLS 1.3 in transit, zero-trust MFA requirements, incident response SLAs, and quarterly penetration testing schedules.',
    tags: ['Security', 'SOC2', 'ISO27001', 'Encryption', 'Access Control'],
    content: `
# Global Enterprise Security & Compliance Policy (2026 Revision)
Document ID: SEC-POL-2026-V4
Classification: Confidential - Security & Audit Only

## 1. Cryptographic Controls & Data Encryption Standards
All company data classified as Internal, Confidential, or Restricted must be encrypted using industry-standard cryptographic algorithms:
- **Data at Rest**: All databases (PostgreSQL, Cloud SQL, Spanner, Redis), object storage buckets (GCS/S3), and block storage disks must use AES-256 encryption with automated monthly key rotation managed through Cloud Key Management Service (KMS).
- **Data in Transit**: All external and inter-service communications must enforce TLS 1.3 with forward secrecy. Deprecated protocols including TLS 1.0, 1.1, and SSLv3 are strictly blocked at our edge reverse proxy.
- **Key Management**: Hardware Security Modules (HSMs) with FIPS 140-3 Level 3 compliance must protect master root keys. No cryptographic keys or service account credentials may be hardcoded or checked into version control repositories.

## 2. Identity & Access Management (Zero Trust Architecture)
Enterprise workforce authentication is governed by strict Zero-Trust principles:
- **Multi-Factor Authentication (MFA)**: Hardware FIDO2 WebAuthn security keys (e.g. YubiKey) or biometric Passkeys are mandatory for all production access. SMS and phone-call OTPs are strictly prohibited due to SIM-swapping risks.
- **Session Lifetimes**: Production administrative sessions expire after 4 hours of inactivity. API bearer tokens have a maximum TTL of 60 minutes with cryptographic refresh validation.
- **Least Privilege Access (RBAC & ABAC)**: Access to production environments requires Just-In-Time (JIT) elevation with multi-party approval and automated revocation after 2 hours.

## 3. Incident Response & Severity Tiers
Security incidents are classified into 4 operational severity tiers:
- **Severity 0 (Critical Breach)**: Active unauthorized data exfiltration or total infrastructure compromise. Requires Executive Incident Commander activation within 15 minutes, containment within 1 hour, and external regulatory disclosure within 72 hours under GDPR Article 33.
- **Severity 1 (High Risk)**: Unauthorized elevated access without detected data loss. Containment SLA is 4 hours.
- **Severity 2 (Medium Risk)**: Suspicious anomalous API behavior or failed brute-force attacks against non-privileged services. Response time SLA is 24 hours.
- **Severity 3 (Low / Informational)**: Minor vulnerability scan anomalies or expired dev certificates. Resolution SLA is 7 business days.

## 4. Continuous Vulnerability Management & Penetration Testing
- Automated daily static application security testing (SAST) and dynamic scanning (DAST) in all CI/CD deployment pipelines.
- Third-party CREST-accredited external penetration tests must be conducted semi-annually (Q1 and Q3).
- Critical CVE remediation SLA: Patches for CVEs with CVSS >= 9.0 must be deployed to production within 48 hours of public advisory release.
`
  },
  {
    id: 'doc_hr_policy_benefits_2026',
    name: 'Global_People_Benefits_RemoteWork_2026.docx',
    type: 'docx',
    department: 'HR',
    classification: 'Internal',
    author: 'People & Culture Global Committee',
    category: 'Human Resources',
    summary: 'Details our 2026 workplace flexibility framework, annual learning budget ($2,500/yr), 18-week paid parental leave, wellness stipends ($150/mo), and comprehensive health plan options.',
    tags: ['HR', 'Benefits', 'Remote Work', 'Parental Leave', 'Stipends'],
    content: `
# Global People Operations Handbook & Benefits Policy (2026)
Document ID: HR-POL-BEN-2026-V2
Classification: Internal - All Active Employees

## 1. Flexible & Hybrid Work Guidelines
We embrace a distributed-first culture designed for flexibility and sustained productivity:
- **Work Modes**: Employees may choose between Remote (100% home-based), Hybrid (1-2 days/week in regional hub), or Office-Centric.
- **Home Office Setup Allowance**: Every full-time hire receives a one-time, non-taxable $1,200 reimbursement for ergonomic desk, chair, and peripheral equipment during their first 60 days.
- **Monthly Connectivity & Wellness Stipend**: All active team members receive $150 per month automatically in their paycheck to cover high-speed internet, mobile service, gym memberships, or mental wellness apps (e.g., Headspace, Calm).
- **Core Collaboration Hours**: Regardless of geographic timezone, teams align synchronously between 10:00 AM and 2:00 PM in their primary cluster timezone (e.g., EST / CET / SGT) for meetings.

## 2. Paid Time Off (PTO), Holidays & Sabbatical Program
- **Flexible Vacation**: Full-time exempt employees have discretionary flexible PTO with a mandatory minimum recommendation of 20 days off per calendar year to prevent burnout.
- **Company-Wide Rest Days**: We observe 12 public regional holidays plus 4 global quarterly "Recharge Fridays" where all internal communications and meetings are paused.
- **Longevity Sabbatical**: Upon reaching 4 consecutive years of service, employees qualify for a 4-week fully paid sabbatical leave in addition to standard PTO.

## 3. Comprehensive Parental & Family Care Leave
- **Paid Primary & Secondary Parental Leave**: 18 consecutive weeks of 100% base pay for all new parents (biological birth, surrogacy, adoption, or foster placement) regardless of gender.
- **Flexible Ramp-Back**: Parents returning from leave may elect a 4-day, 80% work schedule at 100% salary for the first 30 days after returning.
- **Family Planning & Fertility Support**: Lifetime fertility, IVF, egg freezing, and adoption assistance benefits up to $15,000 administered via our global health partner.

## 4. Professional Development & Learning Stipend
- **Annual Learning Budget**: Each employee is allocated $2,500 USD per calendar year for technical certifications (AWS, GCP, CISA, PMP), university courses, industry conferences, and books.
- **Tuition Assistance**: Up to $5,000 annually for approved degree programs related directly to an employee's professional advancement track at the company.
`
  },
  {
    id: 'doc_eng_architecture_k8s_2026',
    name: 'Cloud_Architecture_Microservices_K8s_Standards.md',
    type: 'md',
    department: 'Engineering',
    classification: 'Internal',
    author: 'Core Infrastructure Guild',
    category: 'Engineering Architecture',
    summary: 'Defines container orchestration in Kubernetes, gRPC & REST API design, distributed tracing with OpenTelemetry, circuit breaker patterns via Envoy, and zero-downtime deployment pipelines.',
    tags: ['Architecture', 'Kubernetes', 'Microservices', 'Resilience', 'APIs'],
    content: `
# Cloud Architecture & Engineering Reliability Standards
Document ID: ENG-ARCH-2026-V5
Classification: Internal - Engineering & Product Teams

## 1. Microservice Topology & Communication Protocol
- **Inter-Service Communication**: High-throughput service-to-service communication within the service mesh must use gRPC over HTTP/2 with Protobuf schemas. REST/JSON is reserved exclusively for external public ingress APIs.
- **Service Mesh & Traffic Routing**: Istio service mesh handles mutual TLS (mTLS), circuit breaking, and canary routing across Kubernetes clusters in Google Cloud (GKE) and AWS (EKS).
- **API Versioning & Deprecation**: APIs must follow URI path versioning (e.g., /v1/, /v2/). Deprecated endpoints require a minimum 6-month sunset notice with HTTP header \`Deprecation: true\` and Sunset timestamp.

## 2. Reliability, Circuit Breaker & Retry Patterns
To prevent cascading system failures in distributed microservices:
- **Timeout Defaults**: Default outbound HTTP/gRPC client timeouts are strictly capped at 2,500ms. Database read queries must time out at 1,000ms and write transactions at 3,000ms.
- **Circuit Breaker Configuration**: Outbound service proxies must open circuit breakers when the consecutive error rate exceeds 25% over a 10-second rolling window. While tripped, calls fail fast immediately or return cached graceful degradation payloads for 15 seconds before transitioning to half-open state.
- **Exponential Backoff**: Retries must implement randomized jitter with base delay of 100ms, multiplier of 2.0, and a hard cap of 3 retry attempts for idempotent operations only. Never retry non-idempotent POST requests without unique Idempotency-Key headers.

## 3. Observability, Distributed Tracing & Logging
- **OpenTelemetry Standard**: All applications must export distributed traces, RED metrics (Rate, Errors, Duration), and structured JSON logs to our centralized Datadog and OpenSearch telemetry pipeline.
- **Trace Context Propagation**: Incoming HTTP requests must generate a W3C \`traceparent\` / \`x-correlation-id\` at the ingress proxy, propagated across all downstream microservice calls and database query comments.
- **Data Scrubbing in Logs**: Personally Identifiable Information (PII), credit card numbers, passwords, and API secret keys must be automatically redacted via regex log pipelines before storage.

## 4. Kubernetes Deployment & Rollout Strategy
- **Deployment Archetype**: Blue/Green and Progressive Canary rollouts are enforced via ArgoCD and Flagger.
- **Health Checks**: Every pod must expose \`/healthz\` (liveness check with 5s timeout) and \`/readyz\` (readiness check evaluating downstream dependency connections).
- **Resource Allocations**: Explicit CPU and Memory requests/limits are mandatory. Burst limits must not exceed 200% of requested base allocation to protect node stability.
`
  },
  {
    id: 'doc_sales_pricing_sla_2026',
    name: 'Enterprise_Pricing_SLA_Matrix_CommercialTerms.pdf',
    type: 'pdf',
    department: 'Sales',
    classification: 'Restricted',
    author: 'Commercial Finance & Strategic Pricing Desk',
    category: 'Commercial Strategy',
    summary: 'Confidential commercial contract tiers, volume discounting authority matrix, 99.99% Enterprise uptime SLA commitments, liquidated damages, and payment term requirements.',
    tags: ['Pricing', 'SLA', 'Sales', 'Contracts', 'Discounts'],
    content: `
# Enterprise Commercial Terms, Pricing & SLA Schedule (2026)
Document ID: COM-PRC-2026-RESTRICTED
Classification: Restricted - Executive Leadership & Strategic Sales Only

## 1. Enterprise Subscription Tiers & Annual Contract Value (ACV)
- **Standard Enterprise Tier**: $48,000 / year base platform fee. Includes up to 250 active user seats, 50,000 vector document embeddings/month, 99.9% uptime SLA, and standard 8x5 business support.
- **Premier Enterprise Tier**: $120,000 / year base platform fee. Includes up to 1,000 active seats, unlimited document ingestion, dedicated single-tenant vector database namespace, 99.99% uptime SLA, and 24x7x365 15-minute response time guarantee.
- **Global Strategic Custom Tier**: Negotiated starting at $250,000 / year. Custom on-premises or private VPC deployment, BYO-KMS keys, and dedicated enterprise Technical Account Manager (TAM).

## 2. Discount Approval Authority Matrix
To safeguard gross margins, pricing discounts against list price require explicit authorization:
- **0% to 10% Discount**: Senior Account Executive approval.
- **11% to 20% Discount**: Regional Vice President of Sales approval. Requires minimum 2-year upfront commitment.
- **21% to 35% Discount**: Chief Revenue Officer (CRO) and VP of Finance approval. Requires minimum $150,000 ACV and 3-year term.
- **Above 35% Discount**: Requires unanimous Executive Committee sign-off (CEO + CFO + CRO).

## 3. Service Level Agreement (SLA) & Financial Credit Framework
- **99.99% Uptime Commitment** (Monthly calculated downtime <= 4.32 minutes per month):
  - Uptime between 99.90% and 99.99%: 10% invoice credit for the affected billing month.
  - Uptime between 99.50% and 99.89%: 25% invoice credit for the affected billing month.
  - Uptime below 99.50%: 50% invoice credit plus customer termination right for cause with full prorated refund of prepaid unearned fees.
- **Support Response SLAs**: Critical (P1) outage: <= 15 minutes. Major (P2) impairment: <= 2 hours. Normal (P3) request: <= 8 business hours.

## 4. Payment Terms & Billing Rules
- Standard payment terms are Net 30 from invoice receipt date via ACH or Wire Transfer.
- Multi-year prepaid agreements qualify for an automatic 8% upfront payment discount.
- Late payment interest accrues at 1.5% per month (or maximum statutory limit) for balances past 45 days.
`
  },
  {
    id: 'doc_data_privacy_gdpr_2026',
    name: 'Customer_Data_Privacy_GDPR_CCPA_Framework.docx',
    type: 'docx',
    department: 'Legal',
    classification: 'Confidential',
    author: 'Global Data Protection Office (DPO)',
    category: 'Legal & Privacy',
    summary: 'Covers customer data classification, Data Subject Access Requests (DSAR) 30-day fulfillment, cross-border data transfer mechanisms (SCCs), and automated 90-day retention policies.',
    tags: ['Privacy', 'GDPR', 'CCPA', 'Data Retention', 'Compliance'],
    content: `
# Customer Data Privacy, Retention & DSAR Framework (2026)
Document ID: LEG-PRIV-2026-V3
Classification: Confidential - Legal, Compliance & Executive

## 1. Data Classification & Processing Principles
Under GDPR (EU 2016/679) and CCPA/CPRA regulations, customer data is categorized into strict tiers:
- **Personally Identifiable Information (PII)**: Names, email addresses, corporate phone numbers, IP addresses, and unique device IDs. Processed strictly under the lawful basis of contractual necessity or explicit consent.
- **Sensitive Personal Data (SPI)**: Financial accounts, biometric identifiers, and government IDs. Processing requires elevated encryption and zero-knowledge storage where technically feasible.
- **Aggregated & Anonymized Telemetry**: Non-reversible statistical metrics utilized for AI model fine-tuning and system capacity planning.

## 2. Data Subject Access Requests (DSAR) & Right to Erasure
- **DSAR SLA**: Inquiries regarding data export, rectification, or deletion must be validated and fulfilled within 30 calendar days of verified identity confirmation.
- **Right to Be Forgotten (Erasure Process)**:
  1. Triggering an automated cascade deletion across all relational databases and vector embeddings indices within 7 business days.
  2. Backup snapshots are purged on standard 30-day rotation cycles.
  3. A cryptographic Proof of Deletion Certificate is generated and archived for compliance records.

## 3. Cross-Border International Data Transfers
- European customer data must be stored and processed within EU cloud regions (e.g. Frankfurt, Belgium, Netherlands) by default.
- Cross-border transfers to third countries require active EU Standard Contractual Clauses (SCCs 2021) and Data Privacy Framework (DPF) certifications with ongoing Transfer Impact Assessments (TIAs).

## 4. Data Retention & Automatic Purge Schedules
- **Active Customer Production Data**: Retained for the duration of the commercial agreement plus 90 days grace period following contract termination.
- **Application Audit & Access Logs**: Retained in immutable cold storage for exactly 365 days for SOC 2 forensic auditing, then automatically destroyed.
- **Temporary AI Prompt Cache**: Retained in volatile memory for max 24 hours to prevent model contamination, with zero retention for non-enterprise tiers.
`
  },
  {
    id: 'doc_devsecops_cicd_security_2026',
    name: 'DevSecOps_CI_CD_Pipeline_Security_Standard.md',
    type: 'md',
    department: 'Engineering',
    classification: 'Internal',
    author: 'Security Engineering Guild',
    category: 'Application Security',
    summary: 'Enforces SLSA Level 3 supply chain security, automated container signing via Cosign, SBOM generation, pre-commit secret detection, and automated dependency vulnerability patching.',
    tags: ['DevSecOps', 'CI/CD', 'AppSec', 'Supply Chain', 'SBOM', 'Cosign'],
    content: `
# DevSecOps & CI/CD Pipeline Security Architecture
Document ID: ENG-SEC-2026-V3
Classification: Internal - Engineering & DevOps Teams

## 1. Secure Software Supply Chain (SLSA Level 3 Compliance)
To mitigate software supply chain tampering and dependency hijacking:
- **Cryptographic Provenance**: Every build artifact must generate verifiable SLSA Level 3 provenance metadata signed with Sigstore Cosign keyless signatures bound to GitHub OIDC workflow tokens.
- **Software Bill of Materials (SBOM)**: Syft generates CycloneDX and SPDX format SBOMs during every container compilation. Artifacts without validated SBOMs are rejected by Kubernetes admission controllers.
- **Hermetic Build Environments**: CI runners execute on ephemeral, hardened Linux VMs with network egress restricted to authenticated artifact registries (Google Artifact Registry, AWS ECR).

## 2. Automated Static Analysis, SAST & Secrets Detection
- **Pre-Commit Secrets Scanning**: GitGuardian and TruffleHog pre-commit hooks intercept plaintext API keys, AWS credentials, and private certificates before git push. Commits containing detected secrets are rejected at the repository level.
- **Static Application Security Testing (SAST)**: Semgrep and SonarQube scan every Pull Request. Pull Requests containing OWASP Top 10 High/Critical findings are hard-blocked from merging.
- **Dynamic Application Security Testing (DAST)**: Automated OWASP ZAP and Nuclei scans execute against staging environments on every nightly build.

## 3. Container Image Security & Vulnerability SLA
- **Base Images**: All production containers must derive from distroless or minimal Chainguard/Alpine hardened base images. Root execution is prohibited (\`USER nonroot:nonroot\`).
- **Container Scanning**: Trivy and Grype scan images during build and continuously in the container registry.
- **Vulnerability Remediation SLAs**:
  - Critical CVE (CVSS >= 9.0): Must be patched and deployed within 48 hours.
  - High CVE (CVSS 7.0 - 8.9): Must be remediated within 14 calendar days.
  - Medium/Low CVE: Resolved in standard monthly patch sprints.

## 4. Branch Protection & Multi-Party Deployment Approvals
- **Protected Branches**: Main and release branches require minimum 2 senior peer code reviews, 100% green CI test suites, and cryptographic commit signing (GPG/SSH).
- **Production Deployments**: Production deployments require approval from at least 1 designated Release Manager via Slack/PagerDuty webhook integration with automated rollback triggers on error rate spikes (> 1.0% in 5 minutes).
`
  },
  {
    id: 'doc_zero_trust_network_infra_2026',
    name: 'Zero_Trust_Network_Infrastructure_Security_Spec.md',
    type: 'md',
    department: 'Security',
    classification: 'Confidential',
    author: 'Cloud Infrastructure & SecOps',
    category: 'Infrastructure Security',
    summary: 'Specifies enterprise Zero-Trust network segmentation, SPIFFE/SPIRE mutual TLS, cloud edge WAF protection, bastionless SSH access via Cloud IAP, and dynamic HashiCorp Vault secrets.',
    tags: ['Zero Trust', 'Network Security', 'mTLS', 'WAF', 'Vault', 'IAM'],
    content: `
# Zero Trust Network Architecture & Infrastructure Security Specification
Document ID: SEC-NET-2026-V2
Classification: Confidential - Security & DevOps Guilds

## 1. Network Segmentation & Micro-Perimeter Architecture
- **Default-Deny Ingress & Egress**: All VPC subnets enforce zero-trust firewalls. Communication between distinct services requires explicit service mesh authorization policies (Istio AuthorizationPolicy).
- **Service Identity & Mutual TLS (mTLS)**: Workload identities are issued via SPIFFE/SPIRE with X.509 SVID certificates rotating automatically every 12 hours. All TCP/HTTP2 traffic between microservices is encrypted with mTLS (TLS 1.3).
- **Private Service Connect**: Public IP addresses are prohibited on backend databases and internal microservices. All connectivity uses private VPC endpoints and Cloud NAT gateways.

## 2. Cloud Edge Protection, WAF & DDoS Defense
- **Edge Web Application Firewall (WAF)**: Cloud Armor and Cloudflare Enterprise inspect all incoming HTTP requests for SQL Injection (SQLi), Cross-Site Scripting (XSS), and Remote Code Execution (RCE).
- **Adaptive Rate Limiting**: Ingress gateways enforce IP-based and token-based rate limits (max 120 requests/minute per client IP for public APIs, 1,000 req/min for authenticated B2B webhooks).
- **DDoS Mitigation**: Automated Layer 3/4 and Layer 7 volumetric attack scrubbing with automated traffic rerouting and Anycast BGP scrubbing centers.

## 3. Bastionless Administration & Privileged Access
- **Zero Public SSH/RDP**: Inbound port 22 and port 3389 are closed across all cloud VPCs.
- **Identity-Aware Proxy (IAP)**: Engineers access production nodes and Kubernetes clusters exclusively through Google Cloud IAP or AWS SSM Session Manager authenticated via enterprise SSO with FIDO2 MFA keys.
- **Session Auditing**: All terminal commands executed during privileged sessions are recorded, streamed to immutable audit logs, and indexed in Datadog SIEM for real-time anomalous command alerts.

## 4. Centralized Dynamic Secrets Management (HashiCorp Vault)
- **Zero Static Credentials**: Applications acquire database credentials and API keys dynamically from HashiCorp Vault.
- **Short-Lived Leases**: Database credentials have a maximum lease duration of 60 minutes.
- **Automated Key Rotation**: Cryptographic keys for AES-256 and HMAC-SHA256 rotate every 30 days via automated Vault transit engine jobs.
`
  },
  {
    id: 'doc_disaster_recovery_database_ha_2026',
    name: 'Database_High_Availability_Disaster_Recovery_Runbook.md',
    type: 'md',
    department: 'Engineering',
    classification: 'Internal',
    author: 'Data Platform & SRE Team',
    category: 'Database & Reliability',
    summary: 'Outlines our database high availability architecture, Spanner and PostgreSQL multi-region replication, RPO < 60 seconds, RTO < 15 minutes, automated failover, and disaster recovery testing.',
    tags: ['Database', 'High Availability', 'Disaster Recovery', 'Spanner', 'PostgreSQL', 'RPO', 'RTO'],
    content: `
# Database High Availability, Replication & Disaster Recovery Runbook
Document ID: ENG-DB-2026-V4
Classification: Internal - Engineering & SRE

## 1. High Availability (HA) & Multi-Region Topology
- **Primary Relational Store**: Google Cloud Spanner / Multi-Region PostgreSQL distributed across 3 distinct cloud availability zones (us-central1-a, b, c) with synchronous multi-Paxos replication.
- **Read Replicas**: Cross-region asynchronous read replicas in us-east1 and europe-west1 serve localized analytical workloads and geographic caching.
- **Automated Health Heartbeats & Failover**: Health monitoring checks evaluate database latency every 2 seconds. In the event of primary zone failure, automated quorum voting promotes the standby replica in under 30 seconds with zero manual intervention.

## 2. Recovery Point Objective (RPO) & Recovery Time Objective (RTO)
Our enterprise disaster recovery tier guarantees:
- **Recovery Point Objective (RPO)**: **< 60 seconds** of potential data loss during catastrophic regional blackouts, achieved via continuous Write-Ahead Log (WAL) streaming.
- **Recovery Time Objective (RTO)**: **< 15 minutes** for complete service restoration and DNS cutover to secondary disaster recovery cloud region.

## 3. Continuous Backup Strategy & Immutability
- **WAL Archiving**: Continuous WAL segments are streamed to multi-region object storage (GCS/S3) configured with Object Retention Locks (WORM storage - Write Once, Read Many).
- **Point-in-Time Recovery (PITR)**: Granular restoration to any microsecond within the past 35 calendar days.
- **Daily Full Backups**: Automated snapshots taken at 02:00 UTC daily, encrypted with customer-managed encryption keys (CMEK) and replicated to a geographically isolated cloud region.

## 4. Disaster Recovery (DR) Simulation & Chaos Engineering
- **Quarterly GameDays**: SRE teams execute automated Chaos Engineering experiments (e.g. simulated region blackouts, split-brain network partitions) in staging and canary clusters.
- **Annual Live Production DR Cutover**: A scheduled live production traffic failover to the secondary cloud region is conducted annually during low-traffic maintenance windows (Q2).
`
  }
];
