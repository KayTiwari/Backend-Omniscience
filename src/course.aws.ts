import type { Problem, Subject } from './course'
import { AwsIcon } from './TechIcons'

// AWS from zero: a foundation module ladder plus a service flashcard deck.
// Modules use the interactive lesson format; flashcards (id aws-card-*) render
// as flip cards from AWS_CARDS via a dedicated branch in App.tsx.

// ---- Service flashcards ----
export type AwsCard = {
  id: string
  service: string
  full: string
  category: string
  what: string
  when: string[]
  remember: string[]
}

function card(
  id: string,
  service: string,
  full: string,
  category: string,
  what: string,
  when: string[],
  remember: string[],
): AwsCard {
  return { id: `aws-card-${id}`, service, full, category, what, when, remember }
}

export const AWS_CARDS: AwsCard[] = [
  // Compute
  card('ec2', 'EC2', 'Elastic Compute Cloud', 'Compute',
    'Rentable virtual servers (instances) you fully control: pick the OS, CPU, and RAM, and run anything.',
    ['You need full control of the server / OS', 'Lift-and-shift an existing app', 'Long-running steady workloads'],
    ['Instance types are families (t/m/c/r) for general/compute/memory', 'Pay on-demand, or save with reserved / spot instances', 'You patch and manage it (unlike Lambda)']),
  card('lambda', 'Lambda', 'AWS Lambda', 'Compute',
    'Serverless functions: upload code, it runs on events and scales from zero, billed per request and millisecond.',
    ['Event-driven glue (S3 upload, queue message, HTTP)', 'Spiky or low traffic', 'No servers to manage'],
    ['Cold starts add latency on the first call after idle', 'Execution time and memory limits apply', 'Stateless: no local state between runs']),
  card('ecs', 'ECS', 'Elastic Container Service', 'Compute',
    "AWS's own container orchestrator: run Docker containers as tasks and services across a cluster.",
    ['Run containers without managing Kubernetes', 'You are already all-in on AWS'],
    ['Simpler than EKS but AWS-specific', 'Runs on EC2 you manage, or on Fargate (serverless)']),
  card('fargate', 'Fargate', 'AWS Fargate', 'Compute',
    'Serverless containers: run ECS or EKS tasks with no servers to provision or patch.',
    ['Containers without managing the underlying machines', 'Variable workloads'],
    ['You pay per task vCPU/memory, no idle servers', 'Removes node management from ECS/EKS']),
  card('beanstalk', 'Elastic Beanstalk', 'AWS Elastic Beanstalk', 'Compute',
    'A platform-as-a-service: upload your app and AWS provisions the servers, load balancer, and scaling for you.',
    ['Deploy a standard web app fast without wiring infra', 'Small teams, simple stacks'],
    ['Less control than raw EC2, more convenience', 'Good on-ramp; teams often graduate to ECS/EKS']),
  // Storage
  card('s3', 'S3', 'Simple Storage Service', 'Storage',
    'Object storage: store and serve files (objects) by key in buckets with eleven-nines durability and unlimited scale.',
    ['User uploads, images, video, backups, logs', 'Static website assets', 'Data-lake files'],
    ['Store blobs here, not in the database (keep only the key)', 'Front it with CloudFront for global delivery', 'Storage classes trade cost for retrieval speed']),
  card('ebs', 'EBS', 'Elastic Block Store', 'Storage',
    'Network-attached disks for EC2 instances: a persistent hard drive you attach to one instance.',
    ['The boot disk and data volume for an EC2 instance', 'Databases running on EC2'],
    ['Attaches to one instance at a time (block storage)', 'Survives instance stop/start; snapshot to back up']),
  card('efs', 'EFS', 'Elastic File System', 'Storage',
    'A shared network file system many EC2 instances can mount at once.',
    ['Shared files across a fleet of servers', 'Lift-and-shift apps expecting a file system'],
    ['Many instances mount it simultaneously (unlike EBS)', 'NFS, scales automatically']),
  card('glacier', 'S3 Glacier', 'Amazon S3 Glacier', 'Storage',
    'Very cheap archival storage for data you rarely access, with slower retrieval.',
    ['Compliance archives, old backups, cold data'],
    ['Much cheaper than standard S3', 'Retrieval takes minutes to hours; not for hot data']),
  // Database
  card('rds', 'RDS', 'Relational Database Service', 'Database',
    'Managed relational databases (PostgreSQL, MySQL, etc.): AWS runs backups, patching, and replication for you.',
    ['Any standard SQL database without ops burden', 'Transactional, join-heavy data'],
    ['Multi-AZ gives automatic failover; read replicas scale reads', 'You pick the engine; AWS manages the box']),
  card('aurora', 'Aurora', 'Amazon Aurora', 'Database',
    "AWS's high-performance MySQL/PostgreSQL-compatible database with cloud-native storage and replication.",
    ['You want RDS but faster and more scalable', 'Cloud-native relational at scale'],
    ['Storage auto-scales; up to 15 read replicas', 'Serverless option scales capacity automatically']),
  card('dynamodb', 'DynamoDB', 'Amazon DynamoDB', 'Database',
    'Managed serverless key-value and document store with single-digit-millisecond latency at any scale.',
    ['High-scale key lookups (sessions, carts, profiles)', 'Predictable latency, serverless'],
    ['Design keys around your access patterns (single-table)', 'A bad partition key creates a hot partition', 'Not for ad-hoc queries and joins']),
  card('elasticache', 'ElastiCache', 'Amazon ElastiCache', 'Database',
    'Managed Redis or Memcached: an in-memory cache layer without running the servers.',
    ['Cache hot data in front of RDS/DynamoDB', 'Sessions, leaderboards, rate-limit counters'],
    ['Redis flavor gives data types, persistence, pub/sub', 'Cuts database load dramatically on read-heavy apps']),
  card('redshift', 'Redshift', 'Amazon Redshift', 'Database',
    'A managed data warehouse for analytics over huge datasets, columnar and massively parallel.',
    ['Business intelligence and reporting over big data', 'Analytical (OLAP) queries, not transactional'],
    ['Columnar storage for fast aggregations', 'For analytics; use RDS/Aurora for app transactions']),
  // Networking
  card('vpc', 'VPC', 'Virtual Private Cloud', 'Networking',
    'Your own isolated private network in AWS, with subnets, route tables, and firewall rules.',
    ['Every real deployment runs inside a VPC', 'Isolate and secure your resources'],
    ['Public subnets face the internet; private ones do not', 'Security groups and NACLs are the firewalls', 'Spans availability zones for redundancy']),
  card('route53', 'Route 53', 'Amazon Route 53', 'Networking',
    'A managed DNS service that resolves your domain names and can route by latency, geography, or health.',
    ['Map your domain to AWS resources', 'Geo or latency-based routing, failover'],
    ['Health checks enable DNS failover', 'Named for DNS port 53']),
  card('cloudfront', 'CloudFront', 'Amazon CloudFront', 'Networking',
    "AWS's CDN: cache and serve content from edge locations near users worldwide.",
    ['Serve S3 assets and APIs with low global latency', 'Offload the origin'],
    ['Pairs with S3 for static sites', 'Caches at the edge; invalidate on deploy']),
  card('elb', 'ELB', 'Elastic Load Balancing', 'Networking',
    'Managed load balancers that spread traffic across instances/containers and health-check them.',
    ['Distribute traffic across a scaling fleet', 'Front for ECS/EKS/EC2'],
    ['ALB is L7 (HTTP, path/host routing); NLB is L4 (fast, TCP)', 'Health checks route around dead targets']),
  card('apigateway', 'API Gateway', 'Amazon API Gateway', 'Networking',
    'A managed front door for APIs: routing, auth, rate limiting, and throttling, often in front of Lambda.',
    ['Expose Lambda or services as a REST/HTTP API', 'Centralize auth and rate limits'],
    ['Common pairing: API Gateway + Lambda (serverless API)', 'Handles throttling and request validation']),
  // Integration
  card('sqs', 'SQS', 'Simple Queue Service', 'Integration',
    'A fully managed message queue: durable, at-least-once delivery, with a built-in dead-letter queue.',
    ['Decouple services; smooth traffic spikes', 'Background job processing'],
    ['Standard (high throughput, maybe duplicates) vs FIFO (ordered, exactly-once)', 'Make consumers idempotent', 'Often paired with Lambda']),
  card('sns', 'SNS', 'Simple Notification Service', 'Integration',
    'Pub/sub messaging: publish one message and fan it out to many subscribers (queues, Lambdas, emails, SMS).',
    ['Fan one event out to many consumers', 'Push notifications, alerts'],
    ['SQS distributes to one consumer; SNS broadcasts to all', 'Common pattern: SNS -> many SQS queues (fanout)']),
  card('eventbridge', 'EventBridge', 'Amazon EventBridge', 'Integration',
    'An event bus that routes events between AWS services and your apps by rules.',
    ['Event-driven architecture across services', 'React to AWS service events'],
    ['Richer routing than SNS; schema registry', 'Decouples producers from consumers']),
  card('stepfunctions', 'Step Functions', 'AWS Step Functions', 'Integration',
    'A managed workflow orchestrator: coordinate multiple Lambdas/services as a state machine with retries.',
    ['Multi-step workflows (order pipeline, ETL)', 'Coordinate services with retries and branching'],
    ['Visual state machine; built-in error handling', 'Good for sagas and long-running flows']),
  card('kinesis', 'Kinesis', 'Amazon Kinesis', 'Integration',
    'Managed real-time streaming for high-volume event data, AWS\'s Kafka-like service.',
    ['Ingest clickstreams, logs, IoT, metrics in real time', 'Feed real-time analytics'],
    ['Partitioned shards like Kafka', 'For streaming; SQS is for queued tasks']),
  // Security
  card('iam', 'IAM', 'Identity and Access Management', 'Security',
    'Controls who (users, roles, services) can do what on which AWS resources, via policies.',
    ['Every AWS account: define permissions', 'Give services least-privilege access'],
    ['Roles grant temporary permissions to services (better than keys)', 'Default-deny; grant least privilege', 'Policies are JSON allow/deny rules']),
  card('cognito', 'Cognito', 'Amazon Cognito', 'Security',
    'Managed user sign-up, sign-in, and identity for your apps, including social and enterprise login.',
    ['User authentication for web/mobile apps', 'Social / federated login'],
    ['User pools (auth) vs identity pools (AWS access)', 'Handles tokens, MFA, password flows']),
  card('kms', 'KMS', 'Key Management Service', 'Security',
    'Managed encryption keys: create, store, and use keys to encrypt data across AWS services.',
    ['Encrypt data at rest (S3, EBS, RDS)', 'Central key management and rotation'],
    ['Integrated into most AWS services with one click', 'Audited via CloudTrail']),
  card('secrets', 'Secrets Manager', 'AWS Secrets Manager', 'Security',
    'Stores and rotates secrets (database passwords, API keys) so they never live in code.',
    ['Keep credentials out of source and env files', 'Automatic secret rotation'],
    ['Apps fetch secrets at runtime via IAM', 'Rotates database credentials automatically']),
  // Observability & management
  card('cloudwatch', 'CloudWatch', 'Amazon CloudWatch', 'Observability',
    "AWS's metrics, logs, and alarms: monitor resources and apps, dashboard them, and alert.",
    ['Monitor every AWS resource', 'Alarms that trigger autoscaling or pages'],
    ['Metrics + logs + alarms in one place', 'Alarms can drive Auto Scaling']),
  card('cloudtrail', 'CloudTrail', 'AWS CloudTrail', 'Observability',
    'An audit log of every API call in your account: who did what, when.',
    ['Security auditing and compliance', 'Investigate what changed'],
    ['Records account activity, not app metrics', 'Essential for incident forensics']),
  card('cloudformation', 'CloudFormation', 'AWS CloudFormation', 'Management',
    'Infrastructure as code: declare your AWS resources in a template and deploy them reproducibly.',
    ['Version-controlled, repeatable infrastructure', 'Spin up identical environments'],
    ['Declarative templates (JSON/YAML)', 'Terraform is the popular cross-cloud alternative']),
  card('autoscaling', 'Auto Scaling', 'AWS Auto Scaling', 'Management',
    'Automatically adds or removes EC2 instances (or capacity) to match load.',
    ['Handle traffic spikes without overprovisioning', 'Keep a healthy instance count'],
    ['Driven by CloudWatch alarms (CPU, queue depth)', 'Pairs with a load balancer across AZs']),
]

export const awsCardById = new Map(AWS_CARDS.map((c) => [c.id, c]))

const cardProblems: Problem[] = AWS_CARDS.map((c) => ({
  id: c.id,
  title: `${c.service} · ${c.category}`,
  type: 'lesson',
  difficulty: 'Warmup',
  minutes: 3,
  prompt: `${c.full}. ${c.what}`,
  checklist: [`Recall what ${c.service} is and when to use it.`],
}))

// ---- Foundation modules ----
const modules: Problem[] = [
  {
    id: 'aws-rung-what-is-aws',
    title: 'Module 1: What Is AWS And The Cloud',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Understand what the cloud is, what AWS rents you, and the mental model behind 200+ services.',
    explanation: `**The cloud is renting computers instead of buying them.** Rather than racking your own servers, you rent compute, storage, and networking from a provider on demand and pay for what you use. AWS (Amazon Web Services) is the largest such provider.

**Why teams use it.** No upfront hardware, scale up or down in minutes, pay-as-you-go, and managed services that handle the operational toil (patching, backups, replication). You trade some control and a monthly bill for speed and elasticity.

**The mental model.** AWS has 200+ services, but they group into a handful of buckets: compute (run code), storage (keep files), databases (keep structured data), networking (connect and route), security (control access), and observability (watch it). Almost everything is one of those, and this course walks them in order.

**The shared responsibility model.** AWS secures the cloud itself (data centers, hardware); you secure what you put in it (your data, access rules, app code). Knowing the line matters: a misconfigured S3 bucket is your fault, not AWS's.`,
    production:
      'Most modern backends run on a cloud provider, and AWS is the market leader, so "can you reason about AWS" is a common interview and on-the-job expectation. The skill is not memorizing 200 services; it is knowing which bucket a problem falls in and the two or three services that solve it.',
    walkthrough: [
      'Say the definition: the cloud is renting computers on demand.',
      'Name the service buckets: compute, storage, database, networking, security, observability.',
      'Draw the shared responsibility line: AWS secures the cloud, you secure what is in it.',
    ],
    questions: ['What does the cloud rent you?', 'What are the main AWS service buckets?', 'Who secures what in the shared responsibility model?'],
    checklist: ['Define cloud computing.', 'List the AWS service buckets.', 'Explain shared responsibility.'],
    interactive: {
      coldOpen:
        'A misconfigured S3 bucket leaks a million customer records. Whose fault is it, AWS\'s or yours? The answer (yours) is the most important sentence in cloud computing, and it has a name: the shared responsibility model. Nobody knows all 200 AWS services, so what is the skill that actually matters?',
      mental: 'AWS is a utility company for computing: you plug in and pay for the compute, storage, and bandwidth you draw, instead of building your own power plant.',
      diagram: {
        nodes: ['AWS', 'Compute', 'Storage & DB', 'Networking'],
        explanations: [
          'AWS is 200+ services, but they group into a handful of buckets.',
          'Compute runs your code: EC2 virtual machines, Lambda functions, and containers.',
          'Storage and databases keep your data: S3 for files, RDS and DynamoDB for structured data.',
          'Networking connects and routes everything: VPC, Route 53, CloudFront, and load balancers.',
        ],
      },      example: {
        code: '# Buying servers vs renting cloud:\nown hardware: weeks to order, fixed capacity, you run it all\nAWS:          minutes to launch, scale on demand, managed services',
        output: 'pay only for what you use, scale up for a spike, scale down after',
        explain: 'The shift is from a capital purchase you must size years ahead to an on-demand utility you size by the hour.',
      },
      predicts: [
        {
          question: 'A public S3 bucket leaks customer data. Under shared responsibility, whose fault is it?',
          options: ['AWS, they host it', 'You, the configuration is your responsibility', 'Nobody'],
          correct: 1,
          why: 'AWS secures the infrastructure; you secure what you put in it and how you configure access. Bucket permissions are yours.',
        },
        {
          question: 'The real AWS skill is...',
          options: ['memorizing all 200 services', 'knowing which bucket a problem falls in and the few services that solve it', 'using the most services'],
          correct: 1,
          why: 'Nobody knows all 200. Mapping a problem to compute/storage/db/networking and the 2-3 right services is the durable skill.',
        },
      ],
      build: {
        simple: 'AWS rents you servers and services over the internet.',
        actually:
          'It is 200+ services that group into a handful of buckets: compute (EC2, Lambda, containers), storage and databases (S3, RDS, DynamoDB), networking (VPC, Route 53, CloudFront, load balancers), plus security (IAM) and observability (CloudWatch). You pay for what you use and scale on demand.',
        breaks:
          'Shared responsibility: AWS secures the infrastructure; YOU secure what you put in it and how you configure access. A public bucket or an open security group is your mistake, not theirs. The skill is mapping a problem to the right bucket, not memorizing all 200 services.',
      },
      doThisNow: [
        {
          task: 'Classify six services into buckets: S3, EC2, RDS, Route 53, IAM, CloudWatch.',
          reveal:
            'Storage: S3. Compute: EC2. Database: RDS. Networking: Route 53. Security: IAM. Observability: CloudWatch. Six services, six buckets. That mapping is the durable skill.',
        },
        {
          task: 'If you have the AWS CLI configured, confirm who you are acting as. (Read-only, no changes.)',
          command: 'aws sts get-caller-identity',
          reveal:
            'It prints your account id, user/role ARN, and user id: exactly the identity whose permissions (IAM) govern everything you can do. No CLI? Just note that every AWS action runs as some identity, which is the next lesson.',
        },
      ],
      warStory:
        'A startup left an S3 bucket set to public "just to test." A scanner found it in hours and downloaded every file. AWS had done its job perfectly; the configuration was the company\'s responsibility. Shared responsibility is not fine print, it is the line between AWS\'s job and yours.',
      tweak: {
        instruction: 'Classify these into buckets: S3, EC2, RDS, Route 53, IAM, CloudWatch.',
        reveal: 'Storage: S3. Compute: EC2. Database: RDS. Networking: Route 53. Security: IAM. Observability: CloudWatch. Six services, six buckets.',
      },
      receipt: {
        explain: [
          'The service buckets and the on-demand pricing model.',
          'What the shared responsibility model puts on you.',
        ],
        command: 'aws sts get-caller-identity',
        question: 'AWS runs everywhere on Earth. How is that infrastructure laid out, and why does it matter for uptime?',
      },
      recap: [
        'The cloud rents compute, storage, and networking on demand.',
        'AWS services group into compute, storage, database, networking, security, observability.',
        'AWS secures the cloud; you secure what you put in it.',
      ],
    },
  },
  {
    id: 'aws-rung-regions',
    title: 'Module 2: Regions, Availability Zones, And The Edge',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Learn how AWS is laid out geographically and why it matters for latency and uptime.',
    explanation: `AWS infrastructure is organized geographically, and the layout drives both latency and availability.

**Regions** are separate geographic areas (us-east-1 in Virginia, eu-west-1 in Ireland). You choose a region close to your users for low latency, and for data-residency laws. Regions are isolated from each other by design.

**Availability Zones (AZs)** are separate data centers within a region, isolated from each other (separate power, network) but close enough for fast links. Running across multiple AZs is how you survive one data center failing: a multi-AZ database has a standby in another AZ ready to take over.

**Edge locations** are a much larger set of small sites near users, used by CloudFront (CDN) and Route 53 to serve cached content and DNS close to people, far more places than there are regions.

**The rule:** spread across AZs for high availability within a region, spread across regions for disaster recovery and global latency, and use the edge to get content near users.`,
    production:
      'The single most common availability mistake is running in one AZ: when that data center has an issue, you are down. Multi-AZ is the baseline for production. Multi-region is the next, costlier step for the highest availability and global reach.',
    walkthrough: [
      'Pick a region near your users (and per data laws).',
      'Spread across AZs so one data center failing does not take you down.',
      'Go multi-region for disaster recovery and global latency.',
      'Use edge locations (CloudFront, Route 53) to get close to users.',
    ],
    questions: ['What is the difference between a region and an AZ?', 'Why run across multiple AZs?', 'What are edge locations for?'],
    checklist: ['Distinguish region, AZ, and edge.', 'Explain multi-AZ for availability.', 'Explain when to go multi-region.'],
    interactive: {
      coldOpen:
        'The cheapest way to run on AWS is in a single availability zone. It is also the most common way to get paged at 3am, because when that one data center has a bad night, you are simply down. The fix is one architectural choice. What is an AZ, and why is spreading across a few of them the production baseline?',
      mental: 'A region is a city, AZs are separate buildings in that city (one fire does not burn them all), and edge locations are corner kiosks all over the world.',
      diagram: {
        nodes: ['Region', 'AZ a', 'AZ b', 'AZ c'],
        explanations: [
          'A region is a geographic area like us-east-1; pick one near your users.',
          'An availability zone is an isolated data center within the region.',
          'A second AZ holds a standby, so one data center failing does not take you down.',
          'Spreading across AZs is the production availability baseline.',
        ],
      },      example: {
        code: '# A multi-AZ database:\nprimary  -> AZ a\nstandby  -> AZ b   (automatic failover if AZ a fails)',
        output: 'AZ a goes down -> standby in AZ b is promoted -> app stays up',
        explain: 'Two AZs, one database, automatic failover. One data center failing becomes a blip instead of an outage.',
      },
      predicts: [
        {
          question: 'You run everything in a single AZ to save money. The risk is...',
          options: ['none', 'that data center failing takes your whole system down', 'higher latency'],
          correct: 1,
          why: 'One AZ is one data center. Its failure is total. Multi-AZ is the baseline precisely to avoid this.',
        },
        {
          question: 'To serve users in Tokyo and London with low latency, you would...',
          options: ['use one region', 'deploy in multiple regions near them, plus the edge (CloudFront)', 'add more AZs'],
          correct: 1,
          why: 'AZs are within one region. Global low latency needs regions near users and edge caching.',
        },
      ],
      build: {
        simple: 'AWS has data centers around the world.',
        actually:
          'A region is a geographic area (us-east-1); an availability zone is an isolated data center within it (own power, own network); edge locations are many small sites near users for CloudFront and Route 53. Spread across AZs for availability within a region, across regions for global reach and disaster recovery.',
        breaks:
          'Running in a single AZ means a single data center failure takes you fully down: the most common availability mistake. Multi-AZ (a standby in another AZ with automatic failover) is the baseline; multi-region is the costlier next step.',
      },
      doThisNow: [
        {
          task: 'Design the layout for an app that must survive a data center outage but serves only one country. Single-AZ, multi-AZ, or multi-region?',
          reveal:
            'Multi-AZ in a single region. It survives a data center failure without the cost and complexity of multi-region, which you would add only for global latency or region-level disaster recovery.',
        },
        {
          task: 'Now extend it: users in both Tokyo and London need low latency. What changes?',
          reveal:
            'Deploy in regions near each (e.g. ap-northeast-1 and eu-west-1) plus CloudFront at the edge. AZs live inside one region, so global latency needs multiple regions, not more AZs.',
        },
      ],
      warStory:
        'A company ran its whole stack in one AZ to cut costs. A power event in that single data center took the entire product offline for hours while competitors in multi-AZ setups never blinked. The savings evaporated in one outage; multi-AZ became non-negotiable the next week.',
      tweak: {
        instruction: 'Decide the layout for an app that must survive a data center outage but serves one country.',
        reveal: 'Single region, multiple AZs (multi-AZ). That survives a data center failure without the cost and complexity of multi-region, which you would add only for global reach or region-level disaster recovery.',
      },
      receipt: {
        explain: [
          'The difference between region, AZ, and edge.',
          'Why multi-AZ is the availability baseline and when to go multi-region.',
        ],
        question: 'Your infrastructure spans data centers. What decides who is allowed to touch any of it?',
      },
      recap: [
        'Region = geographic area; AZ = isolated data center within it; edge = many small sites near users.',
        'Multi-AZ survives a data center failure; multi-region adds global reach and disaster recovery.',
        'Edge locations (CloudFront, Route 53) put content and DNS near users.',
      ],
    },
  },
  {
    id: 'aws-rung-iam',
    title: 'Module 3: IAM: Who Can Do What',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Learn how AWS controls access: users, roles, policies, and least privilege.',
    explanation: `IAM (Identity and Access Management) decides who can do what to which resources. It is the foundation of AWS security and the thing most worth getting right.

**The pieces.** A policy is a JSON document of allow/deny rules (this identity may read this S3 bucket). A user is a person or app with long-lived credentials. A role is a set of permissions that can be temporarily assumed, with no permanent keys, which is the preferred way to grant access.

**Roles over keys.** Hardcoding access keys in an app is the classic AWS leak: keys end up in git and get exploited. Instead, give the EC2 instance or Lambda a role; AWS hands it temporary credentials automatically, and nothing is stored.

**Least privilege.** Grant exactly the permissions needed and no more. The default is deny; you add specific allows. A reporting service should read its tables, not have admin over the account, so one leak does not become a full compromise.

**MFA and the root account.** Protect the root account with MFA and never use it for daily work; create IAM users/roles with scoped permissions instead.`,
    production:
      'Leaked long-lived access keys are a top AWS incident, which is why roles (temporary credentials) are the standard for services. Over-broad policies are the other: a compromised service with admin is a catastrophe; the same service with least privilege is a contained one.',
    walkthrough: [
      'Write access as policies: allow specific actions on specific resources.',
      'Give services roles (temporary credentials), never hardcoded keys.',
      'Grant least privilege: only what each identity needs.',
      'Protect the root account with MFA; use scoped IAM identities for work.',
    ],
    questions: ['Why are roles preferred over access keys?', 'What does least privilege limit?', 'What is an IAM policy?'],
    checklist: ['Explain users, roles, and policies.', 'Justify roles over keys.', 'Apply least privilege.'],
    interactive: {
      coldOpen:
        'One leaked credential is how most cloud breaches start. The difference between "an attacker read one bucket" and "an attacker owned the whole account" is a single principle you decide up front. AWS assumes breach; your job is to make a breach small. What is that principle, and why are stored keys the enemy?',
      mental: 'IAM is the building\'s badge system: each badge (role) opens exactly the doors that job needs, badges expire, and nobody walks around with the master key.',
      diagram: {
        nodes: ['Lambda / EC2', 'IAM role', 'S3 bucket'],
        explanations: [
          'A service like Lambda or EC2 needs permission to act on AWS resources.',
          'An IAM role grants temporary, scoped credentials, with no stored keys to leak.',
          'The role allows exactly what is needed, like read-only access to one bucket.',
        ],
      },      example: {
        code: '# A least-privilege policy (JSON):\n{\n  "Effect": "Allow",\n  "Action": ["s3:GetObject"],\n  "Resource": "arn:aws:s3:::reports/*"\n}',
        output: 'this identity can read objects in the reports bucket, and nothing else',
        explain: 'Default-deny plus one specific allow. The service can read its bucket and cannot touch anything else in the account.',
      },
      predicts: [
        {
          question: 'A Lambda needs to read one S3 bucket. The best way to grant it?',
          options: ['hardcode access keys in the function', 'attach an IAM role scoped to that bucket', 'give it admin to be safe'],
          correct: 1,
          why: 'A role gives temporary credentials with no stored keys, scoped to exactly that bucket. Hardcoded keys leak; admin violates least privilege.',
        },
        {
          question: 'Why does least privilege matter if your code is secure?',
          options: ['it does not', 'a future compromise is contained to what that identity could do', 'it makes things faster'],
          correct: 1,
          why: 'Security assumes breach. Least privilege caps the blast radius so one leaked identity is a contained incident, not account-wide.',
        },
      ],
      build: {
        simple: 'IAM controls who can do what in AWS.',
        actually:
          'IAM is users, roles, and policies (JSON allow/deny rules). Services get IAM roles: temporary, scoped credentials with no stored keys to leak. Least privilege means each identity can do exactly its job and nothing more, so a compromise is contained.',
        breaks:
          'Hardcoded access keys leak and grant standing access; roles avoid that. Giving "admin to be safe" or using the all-powerful root account for daily work means one compromise is account-wide. Lock root behind MFA and never use it routinely.',
      },
      doThisNow: [
        {
          task: 'Write the least-privilege policy intent for a Lambda that only reads the "reports" bucket. What Action and Resource?',
          reveal:
            'Effect Allow, Action s3:GetObject, Resource arn:aws:s3:::reports/*. Default-deny everywhere else. The function can read its one bucket and touch nothing else in the account.',
        },
        {
          task: 'A teammate suggests sharing the root account credentials for a quick task. What do you say, and what is the right move?',
          reveal:
            'No. Root is all-powerful and should be MFA-locked and never used for daily work. Create an IAM role or user scoped to exactly the needed permissions instead.',
        },
      ],
      warStory:
        'A developer hardcoded long-lived AWS keys into a repo for convenience. The repo went public, bots found the keys in minutes, and spun up expensive instances to mine crypto on the company\'s bill. An IAM role with temporary credentials would have left nothing to steal.',
      tweak: {
        instruction: 'A teammate suggests sharing the root account credentials for a quick task. What do you say?',
        reveal: 'No: the root account is all-powerful and should be locked behind MFA and never used for daily work. Create an IAM role or user with exactly the needed permissions instead.',
      },
      receipt: {
        explain: [
          'What IAM users, roles, and policies are.',
          'Why least privilege and roles beat hardcoded keys and admin-for-safety.',
        ],
        question: 'Permissions are set. What are the actual ways to run your code on AWS?',
      },
      recap: [
        'IAM = users, roles, and policies (JSON allow/deny rules).',
        'Roles give services temporary credentials; never hardcode keys.',
        'Least privilege caps the blast radius of any compromise.',
      ],
    },
  },
  {
    id: 'aws-rung-compute',
    title: 'Module 4: Compute: EC2, Containers, And Lambda',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Learn the three ways to run code on AWS and when each fits.',
    explanation: `AWS gives you a spectrum of compute, from "manage the whole server" to "just give me a function."

**EC2 (virtual machines).** Rentable servers you fully control: pick the OS, size, and software. Maximum control and flexibility, but you patch, scale, and manage them. Right for lift-and-shift, steady workloads, and anything needing full OS control.

**Containers (ECS / EKS, on EC2 or Fargate).** Package the app in a Docker image and run it as containers, orchestrated by ECS (AWS-native) or EKS (Kubernetes). Fargate runs them serverless, with no machines to manage. Right for microservices and portable, scalable apps.

**Lambda (serverless functions).** Upload a function; AWS runs it on events and scales from zero, billed per request. No servers at all. Right for event-driven glue and spiky or low traffic, with the trade-offs of cold starts, time limits, and statelessness.

**The spectrum is control vs convenience.** EC2 is most control and most ops; Lambda is least ops and least control; containers sit in between. Pick the least management that meets your needs.`,
    production:
      'A common modern default is containers on Fargate for services plus Lambda for event-driven glue, reserving raw EC2 for workloads that truly need OS control or specific hardware. The cost model differs too: Lambda is cheap for spiky low volume, containers/EC2 cheaper for steady high volume.',
    walkthrough: [
      'Use EC2 when you need full control of the server.',
      'Use containers (ECS/EKS, often on Fargate) for portable, scalable services.',
      'Use Lambda for event-driven, spiky, or low-traffic code.',
      'Pick the least management that meets the need.',
    ],
    questions: ['When do you need EC2 over Lambda?', 'What does Fargate remove?', 'What are Lambda\'s trade-offs?'],
    checklist: ['Place EC2, containers, and Lambda on the control/convenience spectrum.', 'Match a workload to a compute option.', 'Name Lambda\'s trade-offs.'],
    interactive: {
      coldOpen:
        'An image-resize that runs a few times a day on a 24/7 server wastes money idling. A steady high-traffic API on per-request serverless gets a shocking bill. Same mistake, opposite directions: the wrong point on the compute spectrum. Three ways to run code, one axis (control vs convenience). How do you pick?',
      mental: 'Compute is a spectrum from cooking from scratch (EC2: full control, all the work) to a meal kit (containers) to a vending machine (Lambda: instant, no work, less control).',
      diagram: {
        nodes: ['EC2', 'Containers', 'Lambda'],
        explanations: [
          'EC2 is full control of a virtual server: maximum flexibility, but you patch and manage it.',
          'Containers (ECS/EKS, often on Fargate) package the app and scale, with less ops than EC2.',
          'Lambda runs functions on events with no servers at all, the least management.',
        ],
      },      example: {
        code: '# Match the workload:\nlegacy app needing the OS        -> EC2\nmicroservices, portable, scaling -> containers (Fargate)\nresize an image on S3 upload      -> Lambda',
        output: 'each picks the least management that still meets the need',
        explain: 'There is no single best; the workload\'s control needs and traffic shape decide where on the spectrum you land.',
      },
      predicts: [
        {
          question: 'An image-resize that runs only when a user uploads a photo fits best on...',
          options: ['a 24/7 EC2 instance', 'Lambda, triggered by the upload event', 'a data warehouse'],
          correct: 1,
          why: 'Event-driven and spiky is the Lambda sweet spot: it scales from zero and you pay only per resize, versus an always-on server sitting idle.',
        },
        {
          question: 'What does Fargate remove compared to running containers on EC2?',
          options: ['the containers', 'managing the underlying servers (provisioning, patching)', 'the load balancer'],
          correct: 1,
          why: 'Fargate is serverless containers: you define the task, AWS runs it with no machines for you to manage.',
        },
      ],
      build: {
        simple: 'There are a few ways to run your code on AWS.',
        actually:
          'A control-vs-convenience spectrum: EC2 (full virtual servers, you patch and manage), containers (ECS/EKS, often on Fargate which removes the machines), and Lambda (functions on events, no servers, billed per request). Pick the least management that meets the need.',
        breaks:
          'Cost flips by traffic shape: Lambda is cheap for spiky/low volume but expensive (and cold-start-prone) at steady high volume, where containers or EC2 win. Matching compute to the workload is the whole decision.',
      },
      doThisNow: [
        {
          task: 'Match three workloads to a compute option: a legacy app needing OS control, portable scaling microservices, and resizing an image on each S3 upload.',
          reveal:
            'EC2 (OS control), containers on Fargate (portable scaling), Lambda (event-driven, scales from zero, pay per resize). Each picks the least management that still meets the need.',
        },
        {
          task: 'Decide: a steady, high-volume API runs 24/7. Lambda or containers, and why?',
          reveal:
            'Containers (or EC2). At steady high volume, per-request Lambda billing gets expensive and cold starts add latency. Lambda wins for spiky/low traffic; always-on load is cheaper on reserved compute.',
        },
      ],
      warStory:
        'A team ran a high-traffic API on Lambda because "serverless scales." It did scale, and the monthly bill scaled right along with it, far above what a couple of always-on containers would have cost. They moved the steady traffic to Fargate and kept Lambda for the bursty background jobs.',
      tweak: {
        instruction: 'A steady, high-volume service runs 24/7. Lambda or containers, and why?',
        reveal: 'Containers (or EC2): at steady high volume, per-request Lambda billing gets expensive and cold starts add latency. Lambda wins for spiky/low traffic; always-on steady load is cheaper on reserved compute.',
      },
      receipt: {
        explain: [
          'Where EC2, containers, and Lambda sit on the control/convenience spectrum.',
          'How traffic shape decides which is cheaper.',
        ],
        question: 'Your code runs somewhere. Where do its files and data actually live?',
      },
      recap: [
        'EC2 = full control, full ops; Lambda = no servers, less control; containers in between.',
        'Fargate runs containers serverless (no machines to manage).',
        'Lambda fits event-driven and spiky; steady high volume is cheaper on containers/EC2.',
      ],
    },
  },
  {
    id: 'aws-rung-storage',
    title: 'Module 5: Storage: S3, EBS, And EFS',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Learn the three storage types and which to reach for.',
    explanation: `AWS has three storage shapes, and picking wrong is a classic mistake.

**S3 (object storage).** Store files by key in buckets, with eleven-nines durability and unlimited scale. This is where blobs go: uploads, images, video, backups, logs, static assets. It is not a file system or a disk; you GET and PUT whole objects by key.

**EBS (block storage).** A virtual hard drive you attach to one EC2 instance: its boot disk and data volume. Block storage, like a physical disk, attached to a single instance at a time.

**EFS (file storage).** A shared network file system many instances can mount at once, for shared files across a fleet.

**The rule of thumb.** Files and blobs go in S3 (cheapest, most durable, served via CDN). A disk for one server is EBS. A shared file system for many servers is EFS. The most common error is storing large blobs in a database; put them in S3 and keep only the key in the database.`,
    production:
      'S3 is the default home for anything file-shaped, and fronting it with CloudFront is the standard for global delivery. The recurring bug is bloating a relational database with images or documents: it slows every query and costs more than S3, which is purpose-built for it.',
    walkthrough: [
      'Put files and blobs in S3 (durable, cheap, CDN-friendly).',
      'Use EBS as the disk for a single EC2 instance.',
      'Use EFS for a file system shared across many instances.',
      'Keep blobs out of the database, only the S3 key.',
    ],
    questions: ['What goes in S3 vs the database?', 'How does EBS differ from EFS?', 'Why not store images in a relational DB?'],
    checklist: ['Distinguish object, block, and file storage.', 'Choose storage for three scenarios.', 'Explain the blobs-in-the-DB anti-pattern.'],
    interactive: {
      coldOpen:
        'A database mysteriously slows to a crawl, and the cause is not the queries: someone stored 5 MB PDF attachments as blobs in table rows. Every query now hauls megabytes it does not need. AWS has three storage shapes, and putting bytes in the wrong one is the classic mistake. Where do files actually belong?',
      mental: 'S3 is a giant coat check (hand over an item, get a ticket/key). EBS is the hard drive bolted into one computer. EFS is a shared network drive the whole office mounts.',
      diagram: {
        nodes: ['App', 'S3', 'Database'],
        explanations: [
          'The app stores a file plus its metadata.',
          'S3 holds the bytes: durable, cheap object storage built for blobs.',
          'The database keeps only the S3 key, staying small and fast.',
        ],
      },      example: {
        code: '# A user uploads a 5 MB photo:\nbad:  store the 5 MB inside a database row\ngood: store the file in S3, save only s3://bucket/photos/42.jpg in the DB',
        output: 'database stays small and fast; S3 holds the bytes; CloudFront serves them',
        explain: 'The database tracks metadata and the key; S3 holds the bytes. This keeps the database lean and uses each tool for what it is built for.',
      },
      predicts: [
        {
          question: 'Where should user-uploaded videos live?',
          options: ['in the relational database', 'in S3, with the key stored in the database', 'on the web server\'s disk'],
          correct: 1,
          why: 'S3 is built for large objects: durable, cheap, and CDN-frontable. The database keeps only the key.',
        },
        {
          question: 'A fleet of 10 servers needs to read the same shared files. Which storage?',
          options: ['EBS', 'EFS', 'S3 Glacier'],
          correct: 1,
          why: 'EFS is a shared file system many instances mount at once. EBS attaches to only one instance; Glacier is cold archival.',
        },
      ],
      build: {
        simple: 'AWS has a few places to store data.',
        actually:
          'S3 is object storage for files/blobs (key-addressed, eleven-nines durable, cheap, CDN-friendly). EBS is a virtual disk attached to one EC2 instance. EFS is a shared file system many instances mount at once. Files go in S3; the database keeps only the key.',
        breaks:
          'The classic anti-pattern is storing large blobs (images, PDFs, video) inside a relational database, which bloats it and slows every query. S3 is purpose-built for bytes; the database should hold metadata and the S3 key, nothing more.',
      },
      doThisNow: [
        {
          task: 'Place three things: user-uploaded videos, the boot disk for one EC2 server, and shared files read by a fleet of 10 servers.',
          reveal:
            'Videos: S3 (with the key in the DB). Boot disk: EBS (one instance). Shared fleet files: EFS (many instances mount it). Object, block, file: three shapes, three jobs.',
        },
        {
          task: 'Fix a slow database that stores PDF attachments as blobs. What is the change?',
          reveal:
            'Move the PDFs to S3 and replace each blob with its S3 key. The database shrinks dramatically and queries speed up, because it no longer hauls megabytes of file data per row.',
        },
      ],
      warStory:
        'A document app stored uploaded PDFs directly in Postgres rows. As usage grew, backups ballooned to hundreds of gigabytes and every query slowed. Migrating the files to S3 and keeping only the key shrank the database by 90% and made it fast again. The right tool for bytes was never the database.',
      tweak: {
        instruction: 'Your database is huge and slow, and you find it stores PDF attachments as blobs. What is the fix?',
        reveal: 'Move the PDFs to S3 and replace each blob with its S3 key. The database shrinks dramatically and queries speed up, because it no longer hauls megabytes of file data around.',
      },
      receipt: {
        explain: [
          'The difference between object (S3), block (EBS), and file (EFS) storage.',
          'Why blobs belong in S3 with only the key in the database.',
        ],
        question: 'Files live in S3. Where does the structured, queryable data live, and managed by what?',
      },
      recap: [
        'S3 = object storage for files/blobs (durable, cheap, CDN-friendly).',
        'EBS = a disk for one instance; EFS = a file system shared across many.',
        'Store blobs in S3 and only the key in the database.',
      ],
    },
  },
  {
    id: 'aws-rung-databases',
    title: 'Module 6: Databases: RDS, Aurora, And DynamoDB',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Learn the managed database options and when relational vs NoSQL fits.',
    explanation: `AWS runs your databases so you do not have to patch, back up, and replicate them by hand.

**RDS (managed relational).** PostgreSQL, MySQL, and others, managed: AWS handles backups, patching, and replication. Multi-AZ gives automatic failover; read replicas scale reads. Right for standard transactional, join-heavy data, the default for most apps.

**Aurora.** AWS's own MySQL/PostgreSQL-compatible engine, faster and more scalable than stock RDS, with cloud-native storage and up to 15 replicas. A serverless option auto-scales capacity. Right when you want RDS but more performance and scale.

**DynamoDB (managed NoSQL).** A serverless key-value/document store with single-digit-millisecond latency at any scale. Design keys around access patterns; it shines at high-scale key lookups, not ad-hoc queries and joins.

**Plus ElastiCache** (managed Redis/Memcached) in front for caching, and Redshift for analytics warehousing. The choice follows the access pattern, exactly as in the SQL vs NoSQL module: relational by default, DynamoDB for high-scale key access, a cache for hot reads.`,
    production:
      'The pragmatic path: RDS or Aurora for the transactional core, DynamoDB where a specific high-scale key-value pattern outgrows relational, and ElastiCache in front to absorb read load. Multi-AZ on the database is the production availability baseline.',
    walkthrough: [
      'Default to RDS/Aurora for transactional, join-heavy data.',
      'Reach for DynamoDB on high-scale key-value access patterns.',
      'Add ElastiCache to absorb read-heavy load.',
      'Enable multi-AZ for failover; add read replicas for read scale.',
    ],
    questions: ['When is RDS/Aurora the right choice vs DynamoDB?', 'What does multi-AZ give an RDS database?', 'Where does ElastiCache fit?'],
    checklist: ['Choose between relational and DynamoDB by access pattern.', 'Explain multi-AZ and read replicas.', 'Place a cache in the data tier.'],
    interactive: {
      coldOpen:
        'You could run your own Postgres on an EC2 box and spend your nights patching it, backing it up, and praying the failover works. Or AWS does all of that and you pick the right managed service for your access pattern. The same SQL-vs-NoSQL choice from before, now with real service names. Which managed database for which job?',
      mental: 'RDS/Aurora is the managed Swiss-Army relational database; DynamoDB is the specialized high-speed key lookup; ElastiCache is the memory shelf in front of both.',
      diagram: {
        nodes: ['App', 'ElastiCache', 'RDS / Aurora', 'DynamoDB'],
        explanations: [
          'The app reads and writes through the data tier.',
          'ElastiCache absorbs hot reads in memory in front of the database.',
          'RDS or Aurora is the relational core for transactional, join-heavy data.',
          'DynamoDB is the serverless key-value store for high-scale key access.',
        ],
      },      example: {
        code: '# Match the workload:\norders, payments, joins      -> RDS / Aurora (relational)\nsession store at huge scale  -> DynamoDB (key-value)\nhot product reads             -> ElastiCache in front of RDS',
        output: 'relational for transactions, DynamoDB for key access, cache for read load',
        explain: 'Same access-pattern logic as SQL vs NoSQL, now with the managed AWS services that implement each.',
      },
      predicts: [
        {
          question: 'A high-traffic app stores user sessions read by id millions of times. Best fit?',
          options: ['a single RDS instance', 'DynamoDB (or ElastiCache)', 'Redshift'],
          correct: 1,
          why: 'Massive key lookups with predictable latency are DynamoDB\'s sweet spot (ElastiCache works too). A single relational primary would struggle, and Redshift is for analytics.',
        },
        {
          question: 'What does enabling multi-AZ on RDS provide?',
          options: ['faster queries', 'automatic failover to a standby in another AZ', 'more storage'],
          correct: 1,
          why: 'Multi-AZ keeps a synchronized standby in another data center and fails over automatically, the production availability baseline.',
        },
      ],
      build: {
        simple: 'AWS runs managed databases for you.',
        actually:
          'RDS/Aurora is managed relational (backups, patching, multi-AZ failover, read replicas) and the default for transactional join-heavy data. DynamoDB is serverless NoSQL for high-scale key access. ElastiCache (Redis/Memcached) sits in front for hot reads, Redshift for analytics. Choose by access pattern.',
        breaks:
          'DynamoDB shines at key lookups, not ad-hoc queries and joins, so forcing relational workloads onto it hurts. And skipping multi-AZ leaves the database a single point of failure: it is the production availability baseline.',
      },
      doThisNow: [
        {
          task: 'Match three workloads: orders and payments with joins; user sessions read by id at huge scale; hot product reads hammering the DB.',
          reveal:
            'RDS/Aurora for the transactional joins, DynamoDB (or ElastiCache) for the massive key lookups, ElastiCache in front of RDS for the hot reads. Same access-pattern logic, now with managed services.',
        },
        {
          task: 'Your RDS database is overwhelmed by reads on a few hot products. Name two AWS moves before resorting to sharding.',
          reveal:
            'Add read replicas to spread reads, and put ElastiCache in front so most reads never hit the database. Reach for sharding or DynamoDB only if those are not enough.',
        },
      ],
      warStory:
        'A team put their entire transactional app on DynamoDB because it "scales infinitely." The first time the product team asked for a report joining orders to customers, they discovered DynamoDB does not do joins, and rebuilt half the data layer on Aurora. Access pattern, not hype, picks the database.',
      tweak: {
        instruction: 'Your RDS database is overwhelmed by read traffic on a few hot products. Two AWS moves?',
        reveal: 'Add read replicas to spread reads, and put ElastiCache in front so most reads never hit the database at all. Reach for sharding or DynamoDB only if those are not enough.',
      },
      receipt: {
        explain: [
          'When RDS/Aurora fits vs DynamoDB, and where ElastiCache sits.',
          'What multi-AZ and read replicas each provide.',
        ],
        question: 'Compute and data are placed. How does a user\'s request actually reach them, securely?',
      },
      recap: [
        'RDS/Aurora for transactional relational data; DynamoDB for high-scale key-value.',
        'Multi-AZ = automatic failover; read replicas = read scaling.',
        'ElastiCache absorbs read-heavy load in front of the database.',
      ],
    },
  },
  {
    id: 'aws-rung-networking',
    title: 'Module 7: Networking: VPC, Route 53, CloudFront, And Load Balancers',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Learn how requests reach and move through your AWS infrastructure.',
    explanation: `Networking ties everything together: how a request finds your app and how your services talk safely.

**VPC (your private network).** Every deployment lives in a Virtual Private Cloud, your isolated network with subnets. Public subnets face the internet (the load balancer); private subnets do not (the database). Security groups are the per-resource firewalls. The rule: only the load balancer is public; app servers and databases sit in private subnets.

**Route 53 (DNS).** Resolves your domain to AWS resources and can route by latency, geography, or health (failover). It is the first hop, turning your domain name into an address.

**CloudFront (CDN).** Caches and serves content from edge locations near users, fronting S3 and APIs for low global latency.

**Elastic Load Balancing.** Spreads traffic across your instances/containers and health-checks them. ALB is Layer 7 (routes by path and host); NLB is Layer 4 (fast, TCP). It is the public front door to a private fleet.

**The path:** Route 53 resolves the name, CloudFront serves cached content or forwards to the load balancer, the load balancer spreads across app servers in private subnets, which talk to databases in deeper private subnets.`,
    production:
      'The security baseline is a VPC with public-facing load balancers and everything else private, locked down by security groups. The classic mistake is a database in a public subnet reachable from the internet, an open door attackers scan for constantly.',
    walkthrough: [
      'Put public-facing pieces (load balancer) in public subnets, everything else private.',
      'Resolve the domain with Route 53; route by latency/health.',
      'Front static and global content with CloudFront.',
      'Spread traffic with an ALB (L7) or NLB (L4), health-checking targets.',
    ],
    questions: ['What belongs in a public vs private subnet?', 'When is an ALB vs an NLB right?', 'What does Route 53 do first?'],
    checklist: ['Lay out a VPC with public and private subnets.', 'Trace a request from DNS to database.', 'Choose ALB vs NLB.'],
    interactive: {
      coldOpen:
        'Attackers run scanners around the clock looking for one thing: a database with a public path to the internet. Put yours in the wrong subnet and you are on that list within hours. AWS networking is mostly one rule done right: only the front door is public, everything valuable is private. How does a request travel through that, and where does the database hide?',
      mental: 'The VPC is a secure office building: Route 53 is the address, CloudFront the lobby branch nearest you, the load balancer the reception desk, and the database a locked back room no visitor can reach directly.',
      diagram: {
        nodes: ['Route 53', 'CloudFront', 'Load balancer', 'App (private)', 'DB (private)'],
        explanations: [
          'Route 53 resolves your domain name to an address.',
          'CloudFront serves cached content from an edge location near the user.',
          'The load balancer is the public front door, spreading traffic across the fleet.',
          'App servers sit in private subnets, reachable only from the load balancer.',
          'The database sits deeper in private subnets, reachable only from the app.',
        ],
      },      example: {
        code: '# VPC layout:\npublic subnet:  load balancer (internet-facing)\nprivate subnet: app servers (reachable only from the LB)\nprivate subnet: database (reachable only from the app)',
        output: 'only the load balancer is exposed; app and database are unreachable from the internet',
        explain: 'Each layer can only be reached by the layer in front of it. The database has no public path at all, which is the whole point.',
      },
      predicts: [
        {
          question: 'Where should the database live in a VPC?',
          options: ['a public subnet for easy access', 'a private subnet reachable only from the app tier', 'outside the VPC'],
          correct: 1,
          why: 'A database in a public subnet is internet-reachable, a door attackers scan for. It belongs in a private subnet behind the app tier.',
        },
        {
          question: 'You need to route /api and /images to different services by URL path. Which load balancer?',
          options: ['NLB (Layer 4)', 'ALB (Layer 7)', 'Route 53'],
          correct: 1,
          why: 'Routing by path means reading the HTTP request, which is Layer 7: the ALB. NLB operates at L4 (IP/port) and cannot see paths.',
        },
      ],
      build: {
        simple: 'Networking gets requests to your app.',
        actually:
          'Your VPC is a private network with public subnets (the load balancer) and private subnets (app, then database). Route 53 resolves the domain, CloudFront serves cached content from the edge, an ALB (L7, routes by path/host) or NLB (L4, fast TCP) spreads traffic across the private fleet. Security groups are per-resource firewalls.',
        breaks:
          'The classic, dangerous mistake is a database in a public subnet, reachable from the internet, which scanners find constantly. Only the load balancer should be public; each tier is reachable only from the one in front of it.',
      },
      doThisNow: [
        {
          task: 'Lay out a VPC: place a load balancer, app servers, and a database into public vs private subnets.',
          reveal:
            'Load balancer in a public subnet; app servers in a private subnet reachable only from the LB; database in a deeper private subnet reachable only from the app. The database has no public path at all.',
        },
        {
          task: 'Trace a user in Tokyo loading an image. Which AWS pieces run, in order, and which are skipped on a cache hit?',
          reveal:
            'Route 53 resolves the domain, CloudFront serves the image from a Tokyo edge (cache hit). The load balancer and app are not even touched for cached static content; only a cache miss reaches the origin.',
        },
      ],
      warStory:
        'A team launched fast and put RDS in a public subnet "to connect easily from their laptops." Automated scanners found the open database port within a day and began brute-forcing it. Moving the database to a private subnet and connecting through a bastion closed a door that should never have been open.',
      tweak: {
        instruction: 'Trace a user in Tokyo loading an image: which AWS pieces, in order?',
        reveal: 'Route 53 resolves the domain, CloudFront serves the image from a Tokyo edge (likely a cache hit from S3), and only on a miss does it fetch from the origin. The load balancer and app are not even touched for cached static content.',
      },
      receipt: {
        explain: [
          'The public/private subnet layout and the request path through it.',
          'When to use an ALB (L7) vs an NLB (L4).',
        ],
        question: 'Synchronous traffic is handled. How do you run background work, scale automatically, and watch it all?',
      },
      recap: [
        'VPC: public subnets for the load balancer, private for app and database.',
        'Route 53 resolves DNS; CloudFront serves from the edge; ELB spreads traffic.',
        'ALB routes at L7 (path/host); NLB is fast L4 (TCP).',
      ],
    },
  },
  {
    id: 'aws-rung-async-ops',
    title: 'Module 8: Messaging, Scaling, And Observability',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Tie it together: decouple with queues, scale automatically, and watch it all.',
    explanation: `The last layer is what makes an AWS system resilient and operable.

**Messaging (SQS, SNS, EventBridge).** SQS is a managed queue: drop work on it and let workers (or Lambdas) drain it, smoothing spikes and decoupling services. SNS is pub/sub: publish once, fan out to many subscribers. EventBridge is an event bus routing events between services by rules. The pattern: a web tier drops messages on SQS, workers process them, and one event can fan out via SNS to several queues.

**Scaling (Auto Scaling + ELB).** Auto Scaling adds and removes instances to match load, driven by CloudWatch alarms (CPU, queue depth), spread across AZs behind a load balancer. You handle a spike without paying for idle capacity the rest of the time.

**Observability (CloudWatch, CloudTrail, X-Ray).** CloudWatch collects metrics, logs, and alarms (and its alarms drive autoscaling). CloudTrail is the audit log of every API call (who did what). X-Ray traces a request across services. Together they answer how much, what happened, and where the time went.

**The full picture:** Route 53 to CloudFront to a load balancer to an auto-scaling app tier that talks to managed databases and decouples slow work onto SQS for workers, all watched by CloudWatch.`,
    production:
      'This layer is the difference between an app that runs and one that survives. Decoupling with SQS contains downstream failures, Auto Scaling absorbs spikes, and CloudWatch alarms are what page someone (or trigger scaling) before users notice. Skipping observability means flying blind during incidents.',
    walkthrough: [
      'Decouple slow work onto SQS; fan out events with SNS/EventBridge.',
      'Auto Scale the app tier on CloudWatch alarms, across AZs.',
      'Collect metrics, logs, and alarms in CloudWatch.',
      'Audit with CloudTrail; trace cross-service latency with X-Ray.',
    ],
    questions: ['How do SQS and SNS differ?', 'What drives Auto Scaling?', 'What do CloudWatch, CloudTrail, and X-Ray each answer?'],
    checklist: ['Decouple work with a queue.', 'Explain what triggers autoscaling.', 'Map the three observability tools to their questions.'],
    interactive: {
      coldOpen:
        'Someone deleted a production S3 bucket overnight. Which AWS tool tells you exactly who did it and when? (It is not the one most people guess.) This last layer (queues, autoscaling, observability) is the difference between an app that runs and one that survives an incident. Three tools answer three different questions.',
      mental: 'SQS is the kitchen ticket rail (work waits to be picked up), Auto Scaling hires and sends cooks home as the rush rises and falls, and CloudWatch is the manager watching every station.',
      diagram: {
        nodes: ['App tier', 'SQS', 'Workers', 'CloudWatch'],
        explanations: [
          'The auto-scaled app tier handles requests and offloads slow work.',
          'SQS queues the slow work so the request can return immediately.',
          'Workers (Lambda or EC2) drain the queue at their own pace.',
          'CloudWatch watches metrics and alarms, and its alarms drive autoscaling.',
        ],
      },      example: {
        code: '# Place order:\napp tier: save order, drop "send email" + "notify warehouse" on SQS, return 200\nworkers:  drain SQS and do the slow work\nCloudWatch alarm on queue depth -> Auto Scaling adds workers',
        output: 'checkout stays fast; spikes become backlog; scaling reacts to the alarm',
        explain: 'The queue decouples the user-facing request from slow work, and CloudWatch + Auto Scaling react to load automatically.',
      },
      predicts: [
        {
          question: 'You need one event to trigger email, analytics, and inventory updates. Which service?',
          options: ['SQS (one consumer gets it)', 'SNS or EventBridge (fan out to all)', 'CloudTrail'],
          correct: 1,
          why: 'A queue delivers each message to one consumer. SNS/EventBridge broadcast one event to many subscribers, which is fanout.',
        },
        {
          question: 'What typically triggers Auto Scaling to add instances?',
          options: ['a fixed schedule only', 'a CloudWatch alarm (e.g. high CPU or queue depth)', 'a manual button'],
          correct: 1,
          why: 'Auto Scaling reacts to CloudWatch metrics crossing a threshold, so capacity follows real load automatically.',
        },
      ],
      build: {
        simple: 'AWS can decouple work, scale, and monitor itself.',
        actually:
          'SQS is a managed queue (drop work, workers drain it); SNS/EventBridge fan one event out to many subscribers. Auto Scaling adds and removes instances driven by CloudWatch alarms (CPU, queue depth) across AZs. Observability splits three ways: CloudWatch (metrics/logs/alarms), CloudTrail (audit of who did what), X-Ray (cross-service latency).',
        breaks:
          'SQS gives each message to one consumer, so fan-out needs SNS/EventBridge instead. And skipping observability means flying blind during an incident: CloudWatch alarms are what page someone (and trigger scaling) before users notice.',
      },
      doThisNow: [
        {
          task: 'Pick the service: one "order placed" event must trigger email, analytics, AND inventory updates. SQS or SNS/EventBridge?',
          reveal:
            'SNS or EventBridge. A queue (SQS) delivers each message to one consumer; SNS/EventBridge broadcast one event to all subscribers. Fan-out needs pub/sub, not a queue.',
        },
        {
          task: 'Match the question to the tool: "who deleted this bucket last night?", "is CPU over 80%?", "where did this slow request spend its time?"',
          reveal:
            'CloudTrail (who did what, the audit log), CloudWatch (metrics/alarms like CPU), X-Ray (cross-service request tracing). Three questions, three tools.',
        },
      ],
      warStory:
        'During an outage a team had no tracing and could not tell which of six services was slow, so they guessed and restarted the wrong one twice. After adding X-Ray, the next incident took minutes: the trace pointed straight at the slow database call. Observability is what turns a panicked guess into a diagnosis.',
      tweak: {
        instruction: 'Investigating "who deleted this S3 bucket last night" — which observability tool?',
        reveal: 'CloudTrail: it is the audit log of every API call (who did what, when). CloudWatch is metrics/logs/alarms; X-Ray traces request latency. The "who did what" question is CloudTrail.',
      },
      receipt: {
        explain: [
          'How SQS, SNS/EventBridge, and Auto Scaling make a system resilient.',
          'What CloudWatch, CloudTrail, and X-Ray each answer.',
        ],
        question: 'You can architect on AWS. Which beginner on-ramp do you want to lock in next?',
      },
      recap: [
        'SQS decouples slow work; SNS/EventBridge fan out events to many.',
        'Auto Scaling reacts to CloudWatch alarms, across AZs behind a load balancer.',
        'CloudWatch (how much/what), CloudTrail (who did what), X-Ray (where the time went).',
      ],
    },
  },
]

export const awsSubject: Subject = {
  id: 'aws',
  title: 'AWS',
  subtitle:
    'Cloud from zero: the AWS mental model, regions, IAM, compute, storage, databases, networking, and a flashcard deck of the core services.',
  icon: AwsIcon,
  color: '#ff9900',
  problems: [...modules, ...cardProblems],
}
