# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "marimo",
#     "pandas==2.3.1",
# ]
# ///

import marimo

__generated_with = "0.17.2"
app = marimo.App(width="columns")


@app.cell(column=0)
def _():
    import marimo as mo
    import pandas as pd
    from collections.abc import Callable
    from dataclasses import dataclass

    hours_in_year = 24 * 365

    hours_in_month = 24 * 30


    def B_to_GiB(B):
        return B / 1024**3


    def KiB_to_GiB(KiB):
        return KiB / 1024**2


    def MiB_to_GiB(MiB):
        return MiB / 1024
    return (
        B_to_GiB,
        Callable,
        KiB_to_GiB,
        MiB_to_GiB,
        dataclass,
        hours_in_month,
        hours_in_year,
        mo,
        pd,
    )


@app.cell
def _():

    # ddos protection
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    # Bloom AWS cost modelling

    This notebook attempts to model total costs of running a Bloom deployment in AWS. 

    We model costs to run a highly-available production instance and a non-highly-available testing instance.

    We use AWS us-east-2 (Ohio) as the regions to pull rates from.
    """
    )
    return


@app.cell
def _(
    AWSManagedPrometheus,
    AWSSecretManager,
    AWSShield,
    AWSVPC,
    AlertRequirements,
    Callable,
    CiviFormServerRequirements,
    CloudSQL,
    CloudWatchAlerting,
    CloudWatchLogging,
    Cloudrun,
    DDoSProtectionRequirements,
    DatabaseRequirements,
    ECS,
    ELB,
    EmailRequirements,
    FileStorageRequirements,
    GCPAlerting,
    GCPCloudArmor,
    GCPLogging,
    GCPMetrics,
    GCPNATGatewayNotNeeded,
    GCPSecretManager,
    GCPSecurityCommandCenter,
    GCPVPC,
    GCS,
    GLB,
    GuardDuty,
    KiB_to_GiB,
    LoadBalancerRequirements,
    LoggingRequirements,
    MetricsRequirements,
    MiB_to_GiB,
    NATGateway,
    NATGatewayRequirements,
    RDS,
    S3,
    SES,
    SecretRequirements,
    SecurityMonitoringRequirements,
    Sendgrid,
    SendgridUseExistingSubscription,
    VPCRequirements,
    alerts_cost_per_year,
    civiform_server_cost_per_year,
    database_cost_per_year,
    dataclass,
    ddosprotection_cost_per_year,
    email_cost_per_year,
    filestorage_cost_per_year,
    loadbalancer_cost_per_year,
    logging_cost_per_year,
    metrics_cost_per_year,
    mo,
    natgateway_cost_per_year,
    pd,
    secrets_cost_per_year,
    securitymonitoring_cost_per_year,
    vpc_cost_per_year,
):
    @dataclass
    class CiviFormUsage:
        count_servers: int
        server_vcpu: int
        server_mem_GiB: int

        db_highly_available: bool
        db_storage_capacity_GiB: int
        db_backup_storage_GiB: int

        applicant_sessions_per_year: int
        applicant_per_session_data_transfer_MiB: int

        admin_sessions_per_year: int
        admin_per_session_data_transfer_MiB: int

        api_sessions_per_year: int
        api_per_session_data_transfer_MiB: int

        applicant_file_uploads_per_year: int
        applicant_file_upload_size_KiB: int
        admin_file_downloads_per_year: int

        operator_log_sessions_per_year: int
        operator_per_log_session_data_analyzed_GiB: int

        operator_metric_sessions_per_year: int
        operator_per_metric_session_ratio_total_samples_read: float

        count_metrics_alerted_on: int

        def server_requirements(self):
            return CiviFormServerRequirements(
                count=self.count_servers,
                vcpu=self.server_vcpu,
                mem_GiB=self.server_mem_GiB,
            )

        def database_requirements(self):
            return DatabaseRequirements(
                highly_available=self.db_highly_available,
                storage_capacity_GiB=self.db_storage_capacity_GiB,
                backup_storage_used_GiB=self.db_backup_storage_GiB,
            )

        def filestorage_requirements(self):
            return FileStorageRequirements(
                storage_GiB=KiB_to_GiB(
                    self.applicant_file_uploads_per_year
                    * self.applicant_file_upload_size_KiB
                ),
                put_requests_per_year=self.applicant_file_uploads_per_year,
                get_requests_per_year=self.admin_file_downloads_per_year,
            )

        def email_requirements(self):
            return EmailRequirements(
                emails_sent_per_year=self.applicant_sessions_per_year
            )

        def loadbalancer_requirements(self):
            return LoadBalancerRequirements(
                data_processed_GiB_per_year=(
                    MiB_to_GiB(
                        self.applicant_sessions_per_year
                        * self.applicant_per_session_data_transfer_MiB
                    )
                    + MiB_to_GiB(
                        self.admin_sessions_per_year
                        * self.admin_per_session_data_transfer_MiB
                    )
                    + MiB_to_GiB(
                        self.api_sessions_per_year
                        * self.api_per_session_data_transfer_MiB
                    )
                    + KiB_to_GiB(
                        self.applicant_file_uploads_per_year
                        * self.applicant_file_upload_size_KiB
                    )
                    + KiB_to_GiB(
                        self.admin_file_downloads_per_year
                        * self.applicant_file_upload_size_KiB
                    )
                )
            )

        def vpc_requirements(self):
            # VPC outboard data is any data that is returned back to CiviForm users.
            return VPCRequirements(
                data_transferred_out_GiB_per_year=(
                    MiB_to_GiB(
                        self.applicant_sessions_per_year
                        * self.applicant_per_session_data_transfer_MiB
                    )
                    + MiB_to_GiB(
                        self.admin_sessions_per_year
                        * self.admin_per_session_data_transfer_MiB
                    )
                    + MiB_to_GiB(
                        self.api_sessions_per_year
                        * self.api_per_session_data_transfer_MiB
                    )
                )
            )

        def natgateway_requirements(self):
            # S3, cloudwatch metrics upload, and docker contianer downloads.
            return NATGatewayRequirements(
                data_processed_GiB_per_year=(
                    KiB_to_GiB(
                        self.applicant_file_uploads_per_year
                        * self.applicant_file_upload_size_KiB
                    )
                    + KiB_to_GiB(
                        self.admin_file_downloads_per_year
                        * self.applicant_file_upload_size_KiB
                    )
                    # staging has about 1GiB of metrics traffic per week, lets double it to over-estimate.
                    + (52 * 2)
                    # Current CiviForm contianers are ~300MiB: https://hub.docker.com/r/civiform/civiform/tags?name=v
                    #
                    # Account for tasks upgrading versions once a week
                    + (52 * self.count_servers * MiB_to_GiB(300))
                )
            )

        def logging_requirements(self):
            return LoggingRequirements(
                # staging server logs are ~200MiB per month, lets over-estimate at 4GiB per year per server
                server_logs_data_ingested_per_year_GiB=self.count_servers * 4,
                # staging vpc flow logs are currently retained forever. But the earliest log was
                # on 2024-05-28. At 2025-07-24 the log group had 8.46 GiB stored. So that is
                # 8.46 GiB / 14 months = 0.6 per month = 7.2 GiB a year, lets round up to 8.
                network_logs_data_ingested_per_year_GiB=8,
                # 1-month retention
                logs_kept_in_retention_GiB=((self.count_servers * 4) + 8) / 12,
                log_data_read_per_year_GiB=(
                    self.operator_log_sessions_per_year
                    * self.operator_per_log_session_data_analyzed_GiB
                ),
            )

        def metrics_requirements(self):
            return MetricsRequirements(
                # A sample is collected for every distinct metric at a configurable rate.
                #
                # A single metric definition can cause many distinct metrics based on the cardinality
                # of that metric's labels.
                #
                # Current staging collection costs are ~$90 per month:
                #
                # $90 = X samples * 0.9/10M
                # = 1_000_000_000 samples collected in the month.
                samples_ingested_per_month=1_000_000_000,
                samples_kept_in_retention=1_000_000_000,
                samples_read_per_year=(
                    self.operator_metric_sessions_per_year
                    * 1_000_000_000
                    * self.operator_per_metric_session_ratio_total_samples_read
                ),
                count_dashboard_users=3,
            )

        def alerts_requirements(self):
            return AlertRequirements(self.count_metrics_alerted_on)

        def secrets_requirements(self):
            return SecretRequirements(
                count_secrets=11,
                # read on every server start. Model each server re-starting twice a week (over-estimation).
                count_accesses_per_month=self.count_servers * 2 * 4,
            )

        def securitymonitoring_requirements(self):
            return SecurityMonitoringRequirements(
                # On avg 20 audit logs per session?
                # Factor in 4 deploys a month.
                count_audit_logs_per_month=(
                    20
                    * (
                        self.operator_log_sessions_per_year
                        + self.operator_metric_sessions_per_year
                        + 4
                    )
                )
                / 12,
                # see notes in logging_requirements for how I got this
                network_logs_GiB_per_month=8 / 4,
                # used by GCP Security Command Center
                server_vcpus=self.count_servers * self.server_vcpu,
                cloudsql_vcpus=2 if self.db_highly_available else 4,
                filestorage_get_requests_per_month=self.admin_file_downloads_per_year
                / 12,
                filestorage_put_requests_per_month=self.applicant_file_uploads_per_year
                / 12,
            )

        def ddosprotection_requirements(self):
            return DDoSProtectionRequirements(
                count_requests_per_year=self.applicant_sessions_per_year
                + self.admin_sessions_per_year
                + self.api_sessions_per_year
                + self.applicant_file_uploads_per_year
                + self.admin_file_downloads_per_year
            )


    # These numbers are somewhat total guesses.
    #
    # I guestimated the applicant and admin session data transfer by
    # opening up chrome dev tools, started recording in the networking tab,
    # then clicked around an application page and the admin pages for a bit.
    #
    # The applicant file upload parameters do equal out to around 50GiB of
    # stored files which matches current Seattle usage.
    prod_usage = CiviFormUsage(
        count_servers=2,
        server_vcpu=2,
        server_mem_GiB=4,
        db_highly_available=True,
        db_storage_capacity_GiB=50,
        db_backup_storage_GiB=50 * 7,  # highly unlikely over-estimation
        applicant_sessions_per_year=100_000,
        applicant_per_session_data_transfer_MiB=20,
        admin_sessions_per_year=2_000,
        admin_per_session_data_transfer_MiB=200,
        api_sessions_per_year=2_000,
        api_per_session_data_transfer_MiB=200,
        applicant_file_uploads_per_year=10_000,
        applicant_file_upload_size_KiB=500,
        admin_file_downloads_per_year=30_000,
        operator_log_sessions_per_year=52 * 2,
        operator_per_log_session_data_analyzed_GiB=4,
        operator_metric_sessions_per_year=52 * 2,
        operator_per_metric_session_ratio_total_samples_read=0.5,
        count_metrics_alerted_on=50,  # over-estimation
    )

    # These numbers are also somewhat total guesses.
    staging_usage = CiviFormUsage(
        count_servers=1,
        server_vcpu=1,
        server_mem_GiB=2,
        db_highly_available=False,
        db_storage_capacity_GiB=10,
        db_backup_storage_GiB=10,
        applicant_sessions_per_year=2_000,
        applicant_per_session_data_transfer_MiB=20,
        admin_sessions_per_year=2_000,
        admin_per_session_data_transfer_MiB=200,
        api_sessions_per_year=2_000,
        api_per_session_data_transfer_MiB=200,
        applicant_file_uploads_per_year=2_000,
        applicant_file_upload_size_KiB=20,
        admin_file_downloads_per_year=2_000,
        operator_log_sessions_per_year=26,
        operator_per_log_session_data_analyzed_GiB=1,
        operator_metric_sessions_per_year=26,
        operator_per_metric_session_ratio_total_samples_read=0.2,
        count_metrics_alerted_on=50,
    )


    @dataclass
    class CostItem:
        name: str
        cost_fn: Callable
        aws_provider: any
        gcp_provider: any
        requirements: any


    prod_costs = [
        CostItem(
            "CiviForm servers",
            civiform_server_cost_per_year,
            ECS,
            Cloudrun,
            prod_usage.server_requirements(),
        ),
        CostItem(
            "Database",
            database_cost_per_year,
            RDS,
            CloudSQL,
            prod_usage.database_requirements(),
        ),
        CostItem(
            "FileStorage",
            filestorage_cost_per_year,
            S3,
            GCS,
            prod_usage.filestorage_requirements(),
        ),
        CostItem(
            "Email",
            email_cost_per_year,
            SES,
            Sendgrid,
            prod_usage.email_requirements(),
        ),
        CostItem(
            "VPC",
            vpc_cost_per_year,
            AWSVPC,
            GCPVPC,
            prod_usage.vpc_requirements(),
        ),
        CostItem(
            "LoadBalancer",
            loadbalancer_cost_per_year,
            ELB,
            GLB,
            prod_usage.loadbalancer_requirements(),
        ),
        CostItem(
            "NATGateway",
            natgateway_cost_per_year,
            NATGateway,
            GCPNATGatewayNotNeeded,
            prod_usage.natgateway_requirements(),
        ),
        CostItem(
            "Logging",
            logging_cost_per_year,
            CloudWatchLogging,
            GCPLogging,
            prod_usage.logging_requirements(),
        ),
        CostItem(
            "Metrics",
            metrics_cost_per_year,
            AWSManagedPrometheus,
            GCPMetrics,
            prod_usage.metrics_requirements(),
        ),
        CostItem(
            "Alerts",
            alerts_cost_per_year,
            CloudWatchAlerting,
            GCPAlerting,
            prod_usage.alerts_requirements(),
        ),
        CostItem(
            "Secrets",
            secrets_cost_per_year,
            AWSSecretManager,
            GCPSecretManager,
            prod_usage.secrets_requirements(),
        ),
        CostItem(
            "SecurityMonitoring",
            securitymonitoring_cost_per_year,
            GuardDuty,
            GCPSecurityCommandCenter,
            prod_usage.securitymonitoring_requirements(),
        ),
        CostItem(
            "DDoSProtection",
            ddosprotection_cost_per_year,
            AWSShield,
            GCPCloudArmor,
            prod_usage.ddosprotection_requirements(),
        )
    ]
    staging_costs = [
        CostItem(
            "CiviForm servers",
            civiform_server_cost_per_year,
            ECS,
            Cloudrun,
            staging_usage.server_requirements(),
        ),
        CostItem(
            "Database",
            database_cost_per_year,
            RDS,
            CloudSQL,
            staging_usage.database_requirements(),
        ),
        CostItem(
            "FileStorage",
            filestorage_cost_per_year,
            S3,
            GCS,
            staging_usage.filestorage_requirements(),
        ),
        CostItem(
            "Email",
            email_cost_per_year,
            SES,
            SendgridUseExistingSubscription,
            staging_usage.email_requirements(),
        ),
        CostItem(
            "VPC",
            vpc_cost_per_year,
            AWSVPC,
            GCPVPC,
            staging_usage.vpc_requirements(),
        ),
        CostItem(
            "LoadBalancer",
            loadbalancer_cost_per_year,
            ELB,
            GLB,
            staging_usage.loadbalancer_requirements(),
        ),
        CostItem(
            "NATGateway",
            natgateway_cost_per_year,
            NATGateway,
            GCPNATGatewayNotNeeded,
            staging_usage.natgateway_requirements(),
        ),
        CostItem(
            "Logging",
            logging_cost_per_year,
            CloudWatchLogging,
            GCPLogging,
            staging_usage.logging_requirements(),
        ),
        CostItem(
            "Metrics",
            metrics_cost_per_year,
            AWSManagedPrometheus,
            GCPMetrics,
            staging_usage.metrics_requirements(),
        ),
        CostItem(
            "Alerts",
            alerts_cost_per_year,
            CloudWatchAlerting,
            GCPAlerting,
            staging_usage.alerts_requirements(),
        ),
        CostItem(
            "Secrets",
            secrets_cost_per_year,
            AWSSecretManager,
            GCPSecretManager,
            staging_usage.secrets_requirements(),
        ),
        CostItem(
            "SecurityMonitoring",
            securitymonitoring_cost_per_year,
            GuardDuty,
            GCPSecurityCommandCenter,
            staging_usage.securitymonitoring_requirements(),
        ),
        CostItem(
            "DDoSProtection",
            ddosprotection_cost_per_year,
            AWSShield,
            GCPCloudArmor,
            staging_usage.ddosprotection_requirements(),
        )
    ]


    def df(env, costs):
        return pd.DataFrame(
            [
                {
                    "Environment": env,
                    "Item": c.name,
                    # "Requirements": c.requirements,
                    "AWS (on-demand)": c.cost_fn(c.aws_provider, c.requirements),
                    "GCP (on-demand)": c.cost_fn(c.gcp_provider, c.requirements),
                }
                for c in costs
            ]
        )


    costs = pd.concat(
        [df("prod", prod_costs), df("staging", staging_costs)]
    ).reset_index(drop=True)

    prod_sum = (
        costs[costs.Environment == "prod"].sum(numeric_only=True).to_frame().T
    )
    prod_sum["Item"] = "Prod costs"

    staging_sum = (
        costs[costs.Environment == "staging"].sum(numeric_only=True).to_frame().T
    )
    staging_sum["Item"] = "Staging costs"

    total = costs.sum(numeric_only=True).to_frame().T
    total["Item"] = "Total costs"

    summary = pd.concat([prod_sum, staging_sum, total]).reset_index(drop=True)
    # 'Item' is the last column in these summary DataFrames, reset that.
    cols = summary.columns.to_list()
    last = cols.pop()
    cols.insert(0, last)
    summary = summary[cols]

    mo.vstack(
        [
            summary,
            mo.hstack(
                [
                    mo.ui.table(
                        costs[costs.Environment == "prod"].reset_index(drop=True),
                        page_size=50,
                    ),
                    mo.ui.table(
                        costs[costs.Environment == "staging"].reset_index(
                            drop=True
                        ),
                        page_size=50,
                    ),
                ]
            ),
        ]
    )
    return


@app.cell
def _():
    # Email sending
    return


@app.cell
def _():
    # Networking

    ## Load balancer

    ## VPC data egress to internet

    ## NAT proxy
    return


@app.cell
def _():
    # Observability
    return


@app.cell(column=1)
def _(mo):
    mo.md(
        r"""
    # DDoS Protection

    This column models the cost of GCP Cloud Armor standard. AWS has AWS Shield which also offers DDoS protection.  AWS Shield Standard is free. Cloud Armor has an Enterprise version and AWS Shield has an Advanced version.  Both cost $3,000 per month in addition to data tranfer fees.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class DDoSProtectionRequirements:
        count_requests_per_year: int

    @dataclass
    class DDoSProtectionService:
        cost_per_request: int
    return DDoSProtectionRequirements, DDoSProtectionService


@app.cell
def _(DDoSProtectionRequirements, DDoSProtectionService):
    AWSShield = DDoSProtectionService(cost_per_request=0)

    GCPCloudArmor = DDoSProtectionService(cost_per_request=0.75 / 1_000_000)

    def ddosprotection_cost_per_year(service: DDoSProtectionService, req: DDoSProtectionRequirements):
        return req.count_requests_per_year * service.cost_per_request
    return AWSShield, GCPCloudArmor, ddosprotection_cost_per_year


@app.cell(column=2)
def _(mo):
    mo.md(
        r"""
    # Security monitoring

    This column models the cost of AWS GuardDuty and GCP Security Command Center.
    """
    )
    return


@app.cell
def _(dataclass, hours_in_month):
    @dataclass
    class SecurityMonitoringRequirements:
        # used by AWS GuardDuty
        count_audit_logs_per_month: int
        network_logs_GiB_per_month: int

        # used by GCP Security Command Center
        server_vcpus: int
        cloudsql_vcpus: int
        filestorage_get_requests_per_month: int
        filestorage_put_requests_per_month: int


    # https://aws.amazon.com/guardduty/pricing/
    class GuardDuty:
        def monthly_cost_fn(req: SecurityMonitoringRequirements):
            return (req.count_audit_logs_per_month * (4 / 1_000_000)) + (
                # this rate gets cheaper after the first 500GiB per month but we won't hit that.
                req.network_logs_GiB_per_month * 1
            )


    # https://cloud.google.com/security-command-center/pricing
    #
    # Pricing works by adding a premium on the rate of compute used in the project.
    #
    # I used the organization-level activation premium rates.
    class GCPSecurityCommandCenter:
        def monthly_cost_fn(req: SecurityMonitoringRequirements):
            return (
                (
                    hours_in_month
                    * (req.server_vcpus * 0.0057 + req.cloudsql_vcpus * 0.0057)
                )
                + req.filestorage_get_requests_per_month * (0.00016 / 1_000)  # Class B
                + req.filestorage_put_requests_per_month * (0.0016 / 1_000)  # Class A
            )


    def securitymonitoring_cost_per_year(
        service: any, req: SecurityMonitoringRequirements
    ):
        return 12 * service.monthly_cost_fn(req)
    return (
        GCPSecurityCommandCenter,
        GuardDuty,
        SecurityMonitoringRequirements,
        securitymonitoring_cost_per_year,
    )


@app.cell(column=3)
def _(mo):
    mo.md(
        r"""
    # Secrets

    This column models pricing of AWS Secret Manager and GCP Secret Manager.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class SecretRequirements:
        count_secrets: int
        count_accesses_per_month: int

    @dataclass
    class SecretService:
        monthly_cost_per_secret: float
        cost_per_access: float
    return SecretRequirements, SecretService


@app.cell
def _(SecretRequirements, SecretService):
    # https://aws.amazon.com/secrets-manager/pricing/
    AWSSecretManager = SecretService(
        monthly_cost_per_secret=0.4, cost_per_access=0.05 / 10_000
    )

    # https://cloud.google.com/secret-manager/pricing
    GCPSecretManager = SecretService(
        monthly_cost_per_secret=0.06, cost_per_access=0.03 / 10_000
    )


    def secrets_cost_per_year(service: SecretService, req: SecretRequirements):
        return 12 * (
            (req.count_secrets * service.monthly_cost_per_secret)
            + (req.count_accesses_per_month * service.cost_per_access)
        )
    return AWSSecretManager, GCPSecretManager, secrets_cost_per_year


@app.cell(column=4)
def _(mo):
    mo.md(
        r"""
    # Alerts

    This column models costs of alerts in AWS Cloudwatch and GCP Observability.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class AlertRequirements:
        count_metrics_alerted_on: int

    @dataclass
    class AlertService:
        cost_per_alert_metric: float

    # https://aws.amazon.com/cloudwatch/pricing/
    #
    # Alarms tab
    CloudWatchAlerting = AlertService(
        cost_per_alert_metric=0.1
    )

    # https://cloud.google.com/stackdriver/pricing#google-cloud-observability-pricing
    #
    # There is an additional "$0.35 per 1,000,000 time series returned
    # by the query of a metric alerting policy condition" cost but I am
    # not quite sure how to model it so I leave it unmodelled.
    GCPAlerting = AlertService(
        cost_per_alert_metric=0.1
    )

    def alerts_cost_per_year(service: AlertService, req: AlertRequirements):
        return req.count_metrics_alerted_on * service.cost_per_alert_metric
    return (
        AlertRequirements,
        CloudWatchAlerting,
        GCPAlerting,
        alerts_cost_per_year,
    )


@app.cell(column=5)
def _(mo):
    mo.md(
        r"""
    # Metrics

    This column models metrics costs of AWS Managed Service for Prometheus and GCP Cloud Monitoring.
    """
    )
    return


@app.cell
def _(Callable, dataclass):
    @dataclass
    class MetricsRequirements:
        samples_ingested_per_month: int
        samples_kept_in_retention: int
        samples_read_per_year: int
        count_dashboard_users: int

    @dataclass
    class MetricsService:
        sample_ingestion_cost_fn: Callable[[float], float]
        retention_cost_per_sample: float
        read_cost_per_sample: float
        dashboard_per_user_monthy_fee: float
    return MetricsRequirements, MetricsService


@app.cell
def _(B_to_GiB, MetricsRequirements, MetricsService):
    # A prometheus sample is 1-2 bytes per sample: https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects
    def samples_to_bytes(samples):
        return samples * 1.5


    # https://aws.amazon.com/prometheus/pricing/
    def aws_metrics_sample_ingestion_cost_fn(samples):
        cost = 0
        ten_mil = 10_000_000

        # Over 252 billion samples
        over = samples - 252_000_000_000
        if over > 0:
            cost += over * (0.16 / ten_mil)
            samples = 252_000_000_000

        # 2-252 billion samples
        over = samples - 2_000_000_000
        if over > 0:
            cost += over * (0.35 / ten_mil)
            samples = 2_000_000_000

        # first 2 billion
        return cost + (samples * (0.90 / ten_mil))


    AWSManagedPrometheus = MetricsService(
        sample_ingestion_cost_fn=aws_metrics_sample_ingestion_cost_fn,
        # 0.03 per GiB per month
        retention_cost_per_sample=B_to_GiB(samples_to_bytes(1)) * 0.03 * 12,
        read_cost_per_sample=0.1 / 1_000_000_000,
        dashboard_per_user_monthy_fee=9,  # https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3
    )


    # https://cloud.google.com/stackdriver/pricing#google-cloud-observability-pricing
    def gcp_metrics_sample_ingestion_cost_fn(samples):
        cost = 0
        mil = 1_000_000

        # Over 500 billion samples
        over = samples - 500_000_000_000
        if over > 0:
            cost += over * (0.024 / mil)
            samples = 500_000_000_000

        # 250-500 billion
        over = samples - 250_000_000_000
        if over > 0:
            cost += over * (0.036 / mil)
            samples = 250_000_000_000

        # 50-250 billion
        over = samples - 50_000_000_000
        if over > 0:
            cost += over * (0.048 / mil)
            samples = 50_000_000_000

        # first 50 billion
        return cost + (samples * (0.06 / mil))


    GCPMetrics = MetricsService(
        sample_ingestion_cost_fn=gcp_metrics_sample_ingestion_cost_fn,
        retention_cost_per_sample=0,
        # There is no charge for read API calls issued through the Google Cloud console
        read_cost_per_sample=0,
        dashboard_per_user_monthy_fee=0,
    )


    def metrics_cost_per_year(service: MetricsService, req: MetricsRequirements):
        return 12 * (
            service.sample_ingestion_cost_fn(req.samples_ingested_per_month)
            + (req.samples_kept_in_retention * service.retention_cost_per_sample)
            + (req.samples_read_per_year * service.read_cost_per_sample)
            + (req.count_dashboard_users * service.dashboard_per_user_monthy_fee)
        )
    return AWSManagedPrometheus, GCPMetrics, metrics_cost_per_year


@app.cell(column=6)
def _(mo):
    mo.md(
        r"""
    # Logging

    This column models logging cost between AWS Cloudwatch and GCP Observability.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class LoggingRequirements:
        server_logs_data_ingested_per_year_GiB: float
        network_logs_data_ingested_per_year_GiB: float
        logs_kept_in_retention_GiB: float
        log_data_read_per_year_GiB: float


    @dataclass
    class LoggingService:
        application_ingestion_rate_per_GiB: float
        network_ingestion_rate_per_GiB: float
        retention_rate_per_GiB: float
        read_rate_per_GiB: float
    return LoggingRequirements, LoggingService


@app.cell
def _(LoggingRequirements, LoggingService):
    # https://aws.amazon.com/cloudwatch/pricing/
    #
    # Logs section
    CloudWatchLogging = LoggingService(
        application_ingestion_rate_per_GiB=0.5,
        # this gets cheaper after 10TB per month but we are no-where close to that
        network_ingestion_rate_per_GiB=0.5,
        retention_rate_per_GiB=0.03,
        read_rate_per_GiB=0.005,
    )

    # https://cloud.google.com/stackdriver/pricing#monitoring-costs
    GCPLogging = LoggingService(
        application_ingestion_rate_per_GiB=0.5,
        network_ingestion_rate_per_GiB=0.25,
        # no charge for retention up to 30 days
        retention_rate_per_GiB=0,
        # No additional charges for querying and analyzing log data.
        read_rate_per_GiB=0,
    )


    def logging_cost_per_year(service: LoggingService, req: LoggingRequirements):
        return (
            (
                req.server_logs_data_ingested_per_year_GiB
                * service.application_ingestion_rate_per_GiB
            )
            + (
                req.network_logs_data_ingested_per_year_GiB
                * service.network_ingestion_rate_per_GiB
            )
            + (req.logs_kept_in_retention_GiB * service.retention_rate_per_GiB)
            + (req.log_data_read_per_year_GiB * service.read_rate_per_GiB)
        )
    return CloudWatchLogging, GCPLogging, logging_cost_per_year


@app.cell(column=7)
def _(mo):
    mo.md(
        r"""
    # AWS NAT Gateway

    This column models costs of AWS NAT Gateway.

    NAT Gateway is required to allow ECS tasks with private IP addresses to access docker registry and AWS-hosted services like s3 and cloudwatch metrics.

    GCP Cloudrun does not have the same docker container download restrictions.
    """
    )
    return


@app.cell
def _(dataclass, hours_in_year):
    PiB_in_GiB = 1024**2


    @dataclass
    class NATGatewayRequirements:
        data_processed_GiB_per_year: float


    # https://aws.amazon.com/vpc/pricing/
    #
    # NAT Gateway tab.
    @dataclass
    class NATGateway:
        cost_per_hour = 0.045
        cost_per_GiB_data_processed = 0.045

    @dataclass
    class GCPNATGatewayNotNeeded:
        cost_per_hour = 0
        cost_per_GiB_data_processed = 0

    def natgateway_cost_per_year(pl: any, req: NATGatewayRequirements):
        return (
            hours_in_year * pl.cost_per_hour
        ) + req.data_processed_GiB_per_year * pl.cost_per_GiB_data_processed
    return (
        GCPNATGatewayNotNeeded,
        NATGateway,
        NATGatewayRequirements,
        natgateway_cost_per_year,
    )


@app.cell(column=8)
def _(mo):
    mo.md(
        r"""
    # VPC

    This column models VPC costs in AWS and GCP.
    """
    )
    return


@app.cell
def _(Callable, dataclass):
    @dataclass
    class VPCRequirements:
        data_transferred_out_GiB_per_year: float

    @dataclass
    class VPC:
        # calculates cost of transferring out X GiB of data to internet. 
        cost_fn: Callable[[float], float]
    return VPC, VPCRequirements


@app.cell
def _(VPC, VPCRequirements):
    TiB_in_GiB = 1024


    # https://aws.amazon.com/ec2/pricing/on-demand/
    #
    # DataTransfer OUT From Amazon EC2 To Internet
    def aws_vpc_cost_fn(out_data_per_month_GiB):
        cost = 0

        # Over 150 TiB
        over = out_data_per_month_GiB - 150 * TiB_in_GiB
        if over > 0:
            cost += over * 0.05
            out_data_per_month_GiB = 150 * TiB_in_GiB

        # 50-150 TiB
        over = out_data_per_month_GiB - 50 * TiB_in_GiB
        if over > 0:
            cost += over * 0.07
            out_data_per_month_GiB = 50 * TiB_in_GiB

        # 10-50 TiB
        over = out_data_per_month_GiB - 10 * TiB_in_GiB
        if over > 0:
            cost += over * 0.085
            out_data_per_month_GiB = 10 * TiB_in_GiB

        # First 10 TiB
        return cost + (out_data_per_month_GiB * 0.09)


    AWSVPC = VPC(cost_fn=aws_vpc_cost_fn)


    # https://cloud.google.com/vpc/network-pricing
    #
    # Internet data transfer rates Standard Tier pricing.
    def gcp_vpc_cost_fn(out_data_per_month_GiB):
        cost = 0

        # Over 150 TiB
        over = out_data_per_month_GiB - 150 * TiB_in_GiB
        if over > 0:
            cost += over * 0.045
            out_data_per_month_GiB = 150 * TiB_in_GiB

        # 10-150 TiB
        over = out_data_per_month_GiB - 10 * TiB_in_GiB
        if over > 0:
            cost += over * 0.065
            out_data_per_month_GiB = 10 * TiB_in_GiB

        # First 10 TiB
        return cost + (out_data_per_month_GiB * 0.085)


    GCPVPC = VPC(cost_fn=gcp_vpc_cost_fn)


    def vpc_cost_per_year(vpc: VPC, req: VPCRequirements):
        return vpc.cost_fn(req.data_transferred_out_GiB_per_year / 12)
    return AWSVPC, GCPVPC, vpc_cost_per_year


@app.cell(column=9)
def _(mo):
    mo.md(
        r"""
    # Load Balancer

    This column models costs of Application Load Balancers in AWS Elastic Load Balancer (ELB) and GCP Cloud Load Balancing (GLB).

    ## AWS ELB

    ELB Application Load Balancers have a base rate per hour plus a dynamic rate based on usage.  AWS creates a new unit of measurement called LCU to measure usage.  Each LCU equals:

    - 25 new connections per second
    - 3,000 active connections per minute
    - 1 GB per hour processed bytes
    - 1,000 rule evaluations per second

    All dimensions are evaluated independently and the dimension with the largest LCU is used for the LCU rate for that hour. There are pricing examples on https://aws.amazon.com/elasticloadbalancing/pricing/?nc=sn&loc=3 that help illustrate this.

    For CiviForm my hypothesis is that datatransfer LCU dimension will almost always be the largest.  So I will model the ELB cost based on processed bytes.

    ## GCP GLB

    The base LB rate depends on the number of forwarding rules. For CiviForm Saas there would only be one forwarding rule used. GLB additionally charges based on inbound and outbound data processed by the load balancer. The inbound and outbound rates are the same at the time this notebook was written, so this notebook models these as a combined 'data transferred' rate.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class LoadBalancerRequirements:
        data_processed_GiB_per_year: float

    @dataclass
    class LoadBalancer:
        base_hourly_fee: float
        data_processed_cost_per_GiB: float
    return LoadBalancer, LoadBalancerRequirements


@app.cell
def _(LoadBalancer, LoadBalancerRequirements, hours_in_year):
    # https://aws.amazon.com/elasticloadbalancing/pricing/
    ELB = LoadBalancer(
        base_hourly_fee=0.0225,
        # 1 LCU = 1 GB processed
        data_processed_cost_per_GiB=0.008,
    )

    # https://cloud.google.com/vpc/network-pricing
    GLB = LoadBalancer(
        base_hourly_fee=0.025,
        data_processed_cost_per_GiB=0.01,
    )


    def loadbalancer_cost_per_year(
        lb: LoadBalancer, req: LoadBalancerRequirements
    ):
        return (hours_in_year * lb.base_hourly_fee) + (
            req.data_processed_GiB_per_year * lb.data_processed_cost_per_GiB
        )
    return ELB, GLB, loadbalancer_cost_per_year


@app.cell(column=10)
def _(mo):
    mo.md(
        r"""
    # Email sending service

    This column models costs of AWS Simple Email Service (SES) and Sendgrid for GCP. GCP does not have an email sending service so this uses Sendgrid pricing as an estimate. We would have a centralized Sendgrid account so as we add more customers the Sendgrid pricing becomes less and less.  First the first customer we only get savings on the GCP staging env becuase it can share the sendgrid subscription with the prod env.
    """
    )
    return


@app.cell
def _(Callable, dataclass):
    @dataclass
    class EmailRequirements:
        emails_sent_per_year: int


    @dataclass
    class EmailService:
        cost_fn: Callable[[int], float]


    # https://aws.amazon.com/ses/pricing/
    def ses_cost_fn(num_emails):
        return num_emails * (0.1 / 1000)


    SES = EmailService(cost_fn=ses_cost_fn)


    # https://sendgrid.com/en-us/pricing
    #
    # Sendgrid charges a monthly plan rate, not per-email.
    def sendgrid_cost_fn(num_emails):
        if num_emails < 100_000 * 12:
            return 19.95 * 12

        # up to 2,500,000 emails per month
        return 89.95 * 12


    Sendgrid = EmailService(cost_fn=sendgrid_cost_fn)

    SendgridUseExistingSubscription = EmailService(cost_fn=lambda _: 0)


    def email_cost_per_year(service: EmailService, req: EmailRequirements):
        return service.cost_fn(req.emails_sent_per_year)
    return (
        EmailRequirements,
        SES,
        Sendgrid,
        SendgridUseExistingSubscription,
        email_cost_per_year,
    )


@app.cell(column=11)
def _(mo):
    mo.md(
        r"""
    # Applicant file upload storage

    This column models AWS s3 and GCP Cloud Storage (GCS) costs.

    Currently CiviForm only supports uploading and reading uploaded files through the CiviForm server. We do not expose links directly to the cloud storage provider (although this might change https://github.com/civiform/civiform/issues/5025).  So we only have to model storage and API cost and no data transer cost becuase all data transfer will be from CiviForm server to the file storage API within the same region which is free in both AWS and GCP.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class FileStorageRequirements:
        storage_GiB: float
        get_requests_per_year: int
        put_requests_per_year: int

    @dataclass
    class FileService:
        cost_per_GiB_per_month: float
        get_request_cost_per_request: float
        put_request_cost_per_request: float
    return FileService, FileStorageRequirements


@app.cell
def _(FileService, FileStorageRequirements):
    # https://aws.amazon.com/s3/pricing/
    #
    # s3 standard. Rate decreases after first 50TB (will not be reached by civiform).
    S3 = FileService(
        cost_per_GiB_per_month=0.023,
        get_request_cost_per_request=0.0004 / 1000,
        put_request_cost_per_request=0.005 / 1000,
    )

    # https://cloud.google.com/storage/pricing
    #
    # Single region pricing.
    GCS = FileService(
        cost_per_GiB_per_month=0.02,
        get_request_cost_per_request=0.0004 / 1000,  # Class B operations
        put_request_cost_per_request=0.01 / 1000,  # Class A operations
    )


    def filestorage_cost_per_year(
        service: FileService, req: FileStorageRequirements
    ):
        return (
            (12 * req.storage_GiB * service.cost_per_GiB_per_month)
            + (req.get_requests_per_year * service.get_request_cost_per_request)
            + (req.put_requests_per_year * service.put_request_cost_per_request)
        )
    return GCS, S3, filestorage_cost_per_year


@app.cell(column=12)
def _(mo):
    mo.md(
        r"""
    # Database

    This column models costs for a postgres database in AWS Relational Database Service (RDS) and GCP Cloud SQL.
    """
    )
    return


@app.cell
def _(Callable, dataclass):
    @dataclass
    class DatabaseRequirements:
        highly_available: bool
        storage_capacity_GiB: float
        backup_storage_used_GiB: float


    @dataclass
    class DatabaseRates:
        cost_per_hour: float
        storage_cost_per_GiB_month: float

        # function pointer that takes in DB capacity and backup storage used in GiB and returns a monthly cost.
        backup_cost_per_month_fn: Callable[[int, int], float]


    @dataclass
    class DatabaseService:
        single_replica: DatabaseRates
        highly_available: DatabaseRates
    return DatabaseRates, DatabaseRequirements, DatabaseService


@app.cell
def _(DatabaseRates, DatabaseRequirements, DatabaseService, hours_in_year):
    # https://aws.amazon.com/rds/postgresql/pricing/?pg=pr&loc=3
    #
    # Rates are for db.t3.medium instance which has 2 vCPU and 4 GiB memory with gp2 storage.
    #
    # RDS provides database capacity worth of backups for free.
    # Additional backup storage has a rate of 0.095 per GiB month
    def rds_backup_cost_per_month_fn(db_capacity_GiB, backup_storage_GiB):
        return max(0, (backup_storage_GiB - db_capacity_GiB) * 0.095)


    RDS = DatabaseService(
        single_replica=DatabaseRates(
            cost_per_hour=0.072,
            storage_cost_per_GiB_month=0.115,
            backup_cost_per_month_fn=rds_backup_cost_per_month_fn,
        ),
        highly_available=DatabaseRates(
            cost_per_hour=0.145,
            storage_cost_per_GiB_month=0.23,
            backup_cost_per_month_fn=rds_backup_cost_per_month_fn,
        ),
    )


    # https://cloud.google.com/sql/pricing?hl=en
    #
    # Rates are for Enterprise edition with 2 vCPU and 4 GiB memory and SSD storage.
    def cloudsql_backup_cost_per_month_fn(_, backup_storage_GiB):
        return backup_storage_GiB * 0.08


    CloudSQL = DatabaseService(
        single_replica=DatabaseRates(
            cost_per_hour=(2 * 0.0413 + 4 * 0.007),
            storage_cost_per_GiB_month=0.17,
            backup_cost_per_month_fn=cloudsql_backup_cost_per_month_fn,
        ),
        highly_available=DatabaseRates(
            cost_per_hour=(2 * 0.0826 + 4 * 0.014),
            storage_cost_per_GiB_month=0.34,
            backup_cost_per_month_fn=cloudsql_backup_cost_per_month_fn,
        ),
    )


    def database_cost_per_year(db: DatabaseService, req: DatabaseRequirements):
        rates = db.highly_available if req.highly_available else db.single_replica

        backup_cost = rates.backup_cost_per_month_fn(
            req.storage_capacity_GiB, req.backup_storage_used_GiB
        )
        return (hours_in_year * rates.cost_per_hour) + (
            12
            * (
                (req.storage_capacity_GiB * rates.storage_cost_per_GiB_month)
                + backup_cost
            )
        )
    return CloudSQL, RDS, database_cost_per_year


@app.cell(column=13)
def _(mo):
    mo.md(
        r"""
    # Container runtime

    This column models costs for running CiviForm containers in AWS Elastic Container Service (ECS) and GCP Cloudrun.
    """
    )
    return


@app.cell
def _(dataclass):
    @dataclass
    class CiviFormServerRequirements:
        count: int
        vcpu: int
        mem_GiB: float


    @dataclass
    class ContainerRuntime:
        vcpu_cost_per_hour: float
        mem_GiB_cost_per_hour: float
    return CiviFormServerRequirements, ContainerRuntime


@app.cell
def _(CiviFormServerRequirements, ContainerRuntime, hours_in_year):
    # https://aws.amazon.com/fargate/pricing/
    ECS = ContainerRuntime(
        vcpu_cost_per_hour=0.04048, mem_GiB_cost_per_hour=0.004445
    )

    # https://cloud.google.com/run/pricing
    # Rates are give per second so we need to manually make them per hour.
    seconds_in_hour = 60 * 60
    Cloudrun = ContainerRuntime(
        vcpu_cost_per_hour=0.000018 * seconds_in_hour, mem_GiB_cost_per_hour=0.000002 * seconds_in_hour
    )


    def civiform_server_cost_per_year(
        runtime: ContainerRuntime, req: CiviFormServerRequirements
    ):
        return hours_in_year * (
            req.count
            * (
                (req.vcpu * runtime.vcpu_cost_per_hour)
                + (
                    req.mem_GiB
                    * runtime.mem_GiB_cost_per_hour
                )
            )
        )
    return Cloudrun, ECS, civiform_server_cost_per_year


if __name__ == "__main__":
    app.run()
