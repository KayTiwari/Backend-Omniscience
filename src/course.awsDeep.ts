import type { Problem } from './course'

// AWS deep dives. These sit after the eight overview modules in course.aws.ts and
// go one level deeper per area: what the service is, the problems it solves, when
// to reach for it (and when not), an applied backend/system-design scenario, how
// to build it step by step, and the tradeoffs / failure modes / cost / scaling
// concerns. Every lesson is DOING-first. There is no live AWS runtime in-browser,
// so the DOING is design work and real CLI/console steps you run in your own
// account. Each id is aws-rung-deep-* so it sorts with the foundational modules
// in array order (see getProblemPhaseRank in course.ts).

export const awsDeepDives: Problem[] = [
  {
    id: 'aws-rung-deep-mental-model',
    title: 'The AWS Mental Model: Accounts, Regions, AZs, Shared Responsibility',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Lay out the global-to-local hierarchy of AWS (account, region, AZ, subnet) and explain where the line of responsibility between you and AWS falls.',
    explanation: `AWS is a hierarchy you place things into deliberately. From the outside in: an **account** is the billing and isolation boundary; a **region** is a geographic location (us-east-1) with its own copy of services; an **availability zone (AZ)** is one or more physically separate data centers inside a region; and inside a region you carve a **VPC** with **subnets** pinned to specific AZs.

**Why the hierarchy matters.** Spreading across multiple AZs is how you survive a data-center failure; choosing a region close to users cuts latency and satisfies data-residency rules; separate accounts (often via AWS Organizations) isolate prod from dev so a mistake in one cannot touch the other. Almost every reliability and compliance decision is really a placement decision in this tree.

**The shared responsibility model.** AWS is responsible for security *of* the cloud (the hardware, the data centers, the managed-service internals). You are responsible for security *in* the cloud (your IAM policies, your security groups, your data, your patching of anything you run on EC2). Most breaches are on the customer side of that line: a public S3 bucket, an over-broad IAM policy, a leaked key.

**Global vs regional vs zonal.** A few services are global (IAM, Route 53, CloudFront); most are regional (S3, DynamoDB, SQS); some resources are zonal (an EC2 instance, an EBS volume live in one AZ). Knowing which is which tells you what fails together and what you must replicate yourself.`,
    production:
      'Multi-AZ by default, multi-region only when you truly need it, and separate accounts for prod vs non-prod are the three placement habits that prevent a huge class of outages and blast-radius incidents. The shared responsibility line is where audits focus, because the customer side is where the mistakes are.',
    walkthrough: [
      'Name the hierarchy: account, region, AZ, VPC/subnet.',
      'Explain why multi-AZ survives a data-center failure.',
      'Draw the shared responsibility line (of vs in the cloud).',
      'Classify a service as global, regional, or zonal.',
    ],
    questions: [
      'What is the difference between a region and an availability zone?',
      'Who is responsible for a public S3 bucket leaking data, you or AWS?',
      'Why does spreading instances across AZs improve reliability?',
    ],
    checklist: [
      'Lay out account -> region -> AZ -> subnet.',
      'State the shared responsibility split.',
      'Classify three services as global/regional/zonal.',
    ],
    interactive: {
      coldOpen:
        'A single data center catches fire (this has happened). Teams that pinned everything to one availability zone went dark; teams that spread across three kept serving without a blip. Same region, same services, wildly different outcomes, decided entirely by where in the AWS hierarchy they placed their resources. The mental model is not trivia; it is your blast radius.',
      mental:
        'AWS is a tree: account (billing + isolation) > region (geography) > AZ (separate data centers) > VPC/subnet. You place resources in it on purpose, and AWS secures the cloud while you secure what you put in it.',
      diagram: {
        nodes: ['Account', 'Region (us-east-1)', 'AZ a / AZ b / AZ c', 'VPC + subnets', 'Your resources'],
        explanations: [
          'The billing and isolation boundary; prod and dev are often separate accounts.',
          'A geographic location with its own copy of regional services.',
          'Physically separate data centers; spread across them to survive a failure.',
          'Your private network inside the region, with subnets pinned to AZs.',
          'EC2, RDS, and the rest live inside subnets, in specific AZs.',
        ],
      },
      example: {
        code: '# Where do these live?\nIAM, Route 53, CloudFront   -> GLOBAL  (one view across all regions)\nS3, DynamoDB, SQS, Lambda  -> REGIONAL (per region; pick where)\nEC2 instance, EBS volume   -> ZONAL   (one AZ; dies with that AZ)\n\n# Shared responsibility\nAWS  -> security OF the cloud (hardware, data centers, managed internals)\nYOU  -> security IN the cloud (IAM, security groups, data, your patches)',
        output:
          'global  -> survives a region outage automatically\nregional -> survives an AZ outage if you spread across AZs\nzonal    -> you must replicate across AZs yourself\nbreaches -> overwhelmingly on the YOU side of the line',
        explain:
          'An EC2 instance is zonal: if its AZ fails, it is gone, so you run instances in several AZs behind a load balancer. S3 is regional and already replicates across AZs for you. Knowing the tier tells you what you must replicate.',
      },
      build: {
        simple: 'AWS is account > region > AZ > subnet; spread across AZs for reliability.',
        actually:
          'Regions are isolated from each other (data does not silently cross), which is why multi-region is a deliberate, more expensive choice. AZs within a region have fast, low-latency links so multi-AZ is cheap reliability. Accounts via Organizations give hard isolation and per-account billing; many teams run an account per environment or per team with a shared-services account for logging.',
        breaks:
          'Pinning everything to one AZ means an AZ outage takes you down, the most common self-inflicted reliability gap. Assuming a service is global when it is regional (deploying to us-east-1 only, then surprised users in Europe are slow) is a latency and residency mistake. Cross-region data transfer is billed and adds latency, so accidental cross-region calls quietly cost money.',
      },
      doThisNow: [
        {
          task: 'Classify your stack: for each service you use (or plan to), write whether it is global, regional, or zonal, and what fails with it.',
          reveal:
            'A typical web app: Route 53 (global) for DNS, CloudFront (global) for the CDN, an ALB + EC2/ECS (regional service, zonal instances) spread across AZs, RDS multi-AZ (regional, with a standby in another AZ), S3 (regional). The zonal pieces (instances) are the ones you must spread; the rest replicate for you.',
        },
        {
          task: 'Design the account layout for a small company with prod, staging, and dev. Decide how many accounts and why.',
          reveal:
            'A common answer: three accounts (prod, staging, dev) under one Organization, plus a shared logging/security account. Hard isolation means a runaway script in dev cannot delete prod, and per-account billing makes cost attribution trivial. A single account with tags is simpler but offers no hard blast-radius boundary.',
        },
      ],
      warStory:
        'In 2017 a large S3 outage in us-east-1 took down a swath of the internet, including services that assumed S3 was magically global and had no fallback. Regional reality bit hard. The lesson stuck: know which tier each dependency lives in, and do not assume a regional service is global.',
      tweak: {
        instruction: 'A teammate says "we are multi-AZ, so we are safe from a region outage". Correct them in one sentence.',
        reveal:
          'Multi-AZ protects against a data-center (AZ) failure within one region, but a whole-region outage still takes you down; surviving that requires multi-region, which is a much bigger and costlier commitment.',
      },
      receipt: {
        explain: [
          'AWS is account > region > AZ > subnet; spread across AZs for cheap reliability.',
          'AWS secures the cloud; you secure IAM, networking, and data in it.',
        ],
        question: 'The biggest source of customer-side breaches is over-broad permissions. How do you grant exactly the access an app needs and no more?',
      },
      recap: [
        'Hierarchy: account, region, AZ, VPC/subnet; place resources deliberately.',
        'Multi-AZ survives a data center; multi-region survives a region.',
        'Shared responsibility: AWS secures the cloud, you secure what is in it.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-iam',
    title: 'IAM Deep Dive: Roles, Policies, Least Privilege, STS',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 14,
    prompt: 'Explain the difference between an IAM user and an IAM role, what a policy is, and why roles plus STS beat long-lived access keys.',
    explanation: `IAM decides who can do what. The pieces: **policies** are JSON documents listing allowed (or denied) actions on resources; **users** are long-lived identities for humans; **roles** are identities that anything can temporarily assume to get short-lived credentials; and **STS** (Security Token Service) is what hands out those temporary credentials.

**Policies are the rules.** A policy says, for example, "allow s3:GetObject on arn:aws:s3:::my-bucket/*". They attach to users, groups, or roles. The default is implicit deny, so you only get what a policy explicitly allows; an explicit Deny always wins.

**Roles beat users for workloads.** A long-lived access key on an EC2 instance or in a CI pipeline is a leak waiting to happen. Instead, attach a **role** to the instance (an instance profile) or have the pipeline **assume a role**; STS issues short-lived credentials that auto-expire. Nothing long-lived to leak, and access is scoped to exactly that role policy.

**Least privilege.** Grant the minimum actions on the minimum resources, then widen only when something legitimately needs it. Start from "deny all" and add specific allows; never start from admin and try to trim. Cross-account access, federation, and service-to-service calls all flow through assumed roles.`,
    production:
      'Almost every cloud breach traces back to an over-broad permission or a leaked long-lived key. Roles with STS (no static keys), least-privilege policies, and scoping every policy to specific resource ARNs are the controls that contain the blast radius when something does leak.',
    walkthrough: [
      'Distinguish users (long-lived) from roles (assumed, temporary).',
      'Read a policy: effect, action, resource.',
      'Replace a static key with a role + STS.',
      'Scope a policy down to least privilege.',
    ],
    questions: [
      'What is the difference between an IAM user and an IAM role?',
      'Why are temporary role credentials safer than access keys?',
      'What does "least privilege" mean in practice?',
    ],
    checklist: [
      'Explain users vs roles vs policies.',
      'Read effect/action/resource in a policy.',
      'Design a least-privilege policy for an app.',
    ],
    interactive: {
      coldOpen:
        'A developer commits an AWS access key to a public GitHub repo. Within minutes, bots find it and spin up GPU instances mining crypto on the company card. If that key had been a role with short-lived STS credentials, there would have been nothing static to steal. IAM is the difference between a scare and a six-figure bill.',
      mental:
        'Policies say what is allowed. Users are long-lived humans; roles are temporary identities anything can assume via STS. Prefer roles + short-lived credentials, scoped to least privilege.',
      diagram: {
        nodes: ['Identity (user / service / instance)', 'Assume role (STS)', 'Short-lived credentials', 'Policy checked: allow?', 'Action on resource'],
        explanations: [
          'A human, an EC2 instance, a Lambda, or another account.',
          'Instead of a static key, the identity assumes a role.',
          'STS issues credentials that expire in minutes to hours.',
          'The role attached policy is evaluated: explicit allow needed, explicit deny wins.',
          'The action runs only if the policy permits it on that exact resource.',
        ],
      },
      example: {
        code: '// Least-privilege policy: read ONE bucket, nothing else\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject"],\n    "Resource": "arn:aws:s3:::app-uploads/*"\n  }]\n}\n\n// EC2 gets this via an instance role, not a stored key:\n//   instance -> assumes role -> STS short-lived creds -> S3 read',
        output:
          'Effect Allow + Action s3:GetObject + Resource one bucket -> exactly that, nothing more\nno Resource "*" -> cannot touch other buckets\nrole + STS -> no static key on the box to leak\nimplicit deny -> everything not listed is denied',
        explain:
          'The policy grants one action on one bucket. Delivered through an instance role, the EC2 box gets temporary credentials automatically, with no access key sitting on disk to be stolen.',
      },
      build: {
        simple: 'Policies allow actions; roles give temporary credentials; grant least privilege.',
        actually:
          'A role has two parts: a trust policy (who may assume it) and permission policies (what they can do once assumed). Instance profiles attach a role to EC2; Lambda has an execution role; cross-account access is a role in account B that account A is trusted to assume. STS credentials carry an expiry, so even a leaked one dies quickly. Permission boundaries and SCPs (in Organizations) cap what any policy can grant.',
        breaks:
          'Resource: "*" with broad actions is effective admin and the most common over-grant. Long-lived access keys in code, CI, or on instances are the classic leak vector. A too-tight policy fails closed in confusing ways (an app gets AccessDenied with no hint which action), so read CloudTrail to see the exact denied call. Wildcards in actions (s3:*) quietly grant delete and bucket-policy changes, not just read.',
      },
      doThisNow: [
        {
          task: 'Write a least-privilege policy for an image-upload service: it must put objects in one bucket and read one DynamoDB table, nothing else. List the actions and resources.',
          reveal:
            'Actions: s3:PutObject on arn:aws:s3:::app-uploads/* and dynamodb:GetItem/Query on the table ARN. No s3:* (that includes delete and policy changes), no Resource "*". Two statements, each scoped to one resource. That is the whole policy, and it cannot do anything else.',
        },
        {
          task: 'Decide how three consumers should authenticate to AWS: an EC2 app, a GitHub Actions pipeline, and a developer laptop. Pick role-or-key for each.',
          reveal:
            'EC2 app: instance role (no key). GitHub Actions: OIDC federation assuming a role (no stored key). Developer laptop: ideally SSO/Identity Center issuing short-lived credentials, not a permanent access key. The theme: roles and short-lived credentials everywhere, static keys nowhere.',
        },
      ],
      warStory:
        'The 2019 Capital One breach hinged on an over-permissioned role: a misconfigured WAF could assume a role that could list and read S3 buckets far beyond what it needed, and an attacker used that to exfiltrate 100M+ records. Least privilege on that one role would have contained it. Scope roles to exactly what they need.',
      tweak: {
        instruction: 'A policy has "Action": "s3:*", "Resource": "*". Explain the risk and the fix in one sentence.',
        reveal:
          'That grants every S3 action (including delete and changing bucket policies) on every bucket, effectively admin over all storage; scope it to the specific actions (s3:GetObject) and the specific bucket ARN the app actually needs.',
      },
      receipt: {
        explain: [
          'Policies allow specific actions on specific resources; deny is the default.',
          'Roles + STS give short-lived credentials, so prefer them over static keys.',
        ],
        question: 'IAM controls who can call AWS APIs. But what controls which machines can reach each other over the network?',
      },
      recap: [
        'Users are long-lived; roles are assumed for temporary, scoped credentials.',
        'Policies = effect + action + resource; least privilege, scoped ARNs.',
        'Roles + STS beat static keys; explicit deny always wins.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-vpc',
    title: 'VPC Deep Dive: Subnets, Route Tables, Gateways, Security Groups',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 15,
    prompt: 'Explain what makes a subnet public vs private, the role of an internet gateway and a NAT gateway, and the difference between a security group and a NACL.',
    explanation: `A VPC is your private network in a region. You divide it into **subnets** (each pinned to one AZ), control traffic flow with **route tables**, connect to the internet through **gateways**, and firewall resources with **security groups** and **NACLs**.

**Public vs private subnets.** A subnet is "public" only because its route table sends internet-bound traffic to an **internet gateway (IGW)**. A "private" subnet has no such route, so resources there cannot be reached from the internet. The standard layout: load balancers and bastions in public subnets, app servers and databases in private subnets.

**NAT gateway: outbound-only internet.** Private resources still need to reach the internet (to download packages, call APIs). A **NAT gateway** (sitting in a public subnet) lets private instances make outbound connections while staying unreachable from inbound. It is also a real cost line item.

**Two firewalls.** A **security group** is a stateful firewall attached to a resource (instance, RDS): you allow inbound/outbound by port and source, and return traffic is automatically allowed. A **NACL** is a stateless firewall at the subnet boundary: it evaluates each direction independently and supports explicit deny. Security groups are your everyday tool; NACLs are a coarse subnet-level backstop. **VPC endpoints** let you reach AWS services (S3, DynamoDB) privately without going over the internet at all.`,
    production:
      'The canonical secure topology (public subnets for the load balancer, private subnets for app and database, NAT for outbound, security groups referencing each other) is what most production AWS networks look like. Getting it wrong means either a database exposed to the internet or an app that mysteriously cannot reach anything.',
    walkthrough: [
      'Define public vs private by the route table and IGW.',
      'Add a NAT gateway for outbound-only access.',
      'Use security groups (stateful) to allow traffic.',
      'Contrast NACLs (stateless, subnet-level) and add VPC endpoints.',
    ],
    questions: [
      'What actually makes a subnet public?',
      'Why use a NAT gateway instead of an internet gateway for private instances?',
      'What is the difference between a security group and a NACL?',
    ],
    checklist: [
      'Explain public vs private subnets.',
      'Place IGW, NAT, and resources correctly.',
      'Design security groups for a 3-tier app.',
    ],
    interactive: {
      coldOpen:
        'A team launches a database "to get going fast" and, without thinking about subnets, it lands somewhere reachable from the internet with a weak password. Bots find it in hours and encrypt the data for ransom. The fix was free and structural: put the database in a private subnet with no route to the internet. VPC design is security you get by drawing the network correctly.',
      mental:
        'A VPC is your private network. Route tables (to an IGW) make a subnet public; a NAT gateway gives private subnets outbound-only internet; security groups (stateful) firewall resources; NACLs (stateless) firewall subnets.',
      diagram: {
        nodes: ['Internet', 'IGW + public subnet (ALB, NAT)', 'Private subnet (app servers)', 'Private subnet (database)', 'NAT gateway (outbound only)'],
        explanations: [
          'Untrusted; only the load balancer is exposed to it.',
          'Public subnet: route table sends 0.0.0.0/0 to the internet gateway.',
          'Private app tier: reachable only from the ALB security group.',
          'Private data tier: reachable only from the app security group, never the internet.',
          'Lets private instances make outbound calls without being inbound-reachable.',
        ],
      },
      example: {
        code: '# What makes a subnet public:\npublic subnet  route table: 0.0.0.0/0 -> internet gateway (igw-...)\nprivate subnet route table: 0.0.0.0/0 -> nat gateway (nat-...)   # outbound only\n\n# Security groups reference each other (no IP hardcoding):\nALB SG:  allow inbound 443 from 0.0.0.0/0\napp SG:  allow inbound 8080 from ALB SG\ndb  SG:  allow inbound 5432 from app SG\n# return traffic auto-allowed (stateful)',
        output:
          'public  -> route to IGW (internet-facing)\nprivate -> route to NAT (outbound) or no internet route at all\nSG chain -> only the next tier can reach the previous one\nstateful -> you allow inbound 443; the response goes back automatically',
        explain:
          'Subnets are public or private purely by their route. Security groups chain by referencing each other, so the database accepts traffic only from the app tier, never from the internet, with no brittle IP lists.',
      },
      build: {
        simple: 'Route to IGW = public; route to NAT = private+outbound; security groups allow traffic.',
        actually:
          'Security groups are stateful and allow-only (no deny rules) attached to ENIs; referencing another SG as the source is the idiom that survives instances scaling in and out. NACLs are stateless (you must allow both directions and ephemeral return ports), ordered, support deny, and apply at the subnet edge. VPC endpoints (gateway type for S3/DynamoDB, interface type for most others) keep traffic on the AWS network, cutting NAT cost and data exposure.',
        breaks:
          'A database in a public subnet (or a security group allowing 0.0.0.0/0 on the DB port) is the classic exposure. Forgetting a NAT gateway means private instances cannot pull updates or call external APIs and time out mysteriously. NAT gateways bill per hour and per GB processed, so routing all egress through one (especially cross-AZ) gets expensive. NACL rules are evaluated in order and statelessly, so a missing ephemeral-port allow silently breaks return traffic.',
      },
      doThisNow: [
        {
          task: 'Design the subnet and security-group layout for a 3-tier app (ALB -> app servers -> Postgres). Say which tier goes in which subnet type and what each security group allows.',
          reveal:
            'ALB in public subnets (inbound 443 from anywhere). App servers in private subnets (inbound from the ALB SG only). Postgres in private subnets (inbound 5432 from the app SG only). NAT gateway in a public subnet for app-tier outbound. Nothing but the ALB is reachable from the internet, and each tier accepts traffic only from the one in front of it.',
        },
        {
          task: 'A private Lambda needs to read from S3 a lot and your NAT bill is climbing. Propose a change that cuts cost and exposure.',
          reveal:
            'Add a gateway VPC endpoint for S3. Traffic to S3 then stays on the AWS network and bypasses the NAT gateway entirely, removing both the per-GB NAT charge for that traffic and the internet round trip. Gateway endpoints for S3 and DynamoDB are free.',
        },
      ],
      warStory:
        'A startup put a MongoDB on a public subnet with default credentials to move fast before launch. Within a day automated scanners wiped it and left a ransom note. There was no backup. A private subnet (zero internet route) plus a security group scoped to the app tier would have cost nothing and prevented it entirely. Databases belong in private subnets, always.',
      tweak: {
        instruction: 'Your private EC2 instances cannot run apt update and time out, but inbound access works fine. What is missing?',
        reveal:
          'A route to a NAT gateway. The instances are private with no outbound internet path, so inbound (from the load balancer) works but outbound (to package repos) fails. Add a NAT gateway in a public subnet and route the private subnet 0.0.0.0/0 to it.',
      },
      receipt: {
        explain: [
          'A subnet is public only if its route table points 0.0.0.0/0 at an internet gateway.',
          'Security groups are stateful per-resource firewalls; reference SGs, not IPs.',
        ],
        question: 'Your network is laid out. What actually runs your code inside it: full servers, containers, or functions?',
      },
      recap: [
        'Public vs private is decided by the route table (IGW vs NAT/none).',
        'NAT = outbound-only internet for private subnets (and a cost line).',
        'Security groups: stateful, per-resource, reference each other; NACLs: stateless, subnet-level.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-compute',
    title: 'Compute Deep Dive: EC2 + Auto Scaling vs ECS/Fargate vs Lambda',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 15,
    prompt: 'Given a workload, choose between EC2 with Auto Scaling, containers on ECS/Fargate, and Lambda, and justify it on control, ops burden, and cost shape.',
    explanation: `AWS gives you three broad ways to run code, trading control for convenience: **EC2** (full virtual machines), **containers** (ECS/Fargate), and **functions** (Lambda). The right choice depends on traffic shape, how much you want to manage, and the cost curve.

**EC2 + Auto Scaling.** You rent virtual machines and control everything (OS, runtime, patching). An **AMI** is the disk image instances boot from; **user data** is a startup script that configures a fresh instance; an **Auto Scaling Group (ASG)** launches and replaces instances to hit a target count or metric. Best for steady, long-running workloads and lift-and-shift where you need full control. You manage the OS.

**Containers (ECS/Fargate).** Package the app in a Docker image and run it as tasks. ECS orchestrates them; **Fargate** runs them with no servers to patch (serverless containers). Best for microservices and teams that want consistent, portable deploys without managing Kubernetes or instances.

**Lambda.** Upload a function; it runs on events, scales from zero to thousands automatically, and you pay per request and per millisecond. Best for event-driven glue, spiky or low traffic, and APIs that can tolerate occasional cold starts. No servers, but limits apply (execution time, package size) and it is stateless.

**The cost shape is the deciding factor.** Lambda is cheapest at low or spiky volume (you pay nothing at idle) and gets expensive at high steady volume. EC2/containers are cheaper at high steady volume but you pay for idle capacity. The crossover point is the real decision.`,
    production:
      'A common, healthy pattern is mixed: Lambda for event-driven and bursty pieces, Fargate for steady services that want container portability without node management, and EC2 only where you need special hardware (GPUs) or full OS control. Choosing one hammer for every workload is how you overpay or hit a wall.',
    walkthrough: [
      'Match workload shape to EC2, containers, or Lambda.',
      'Explain AMI, user data, and an Auto Scaling Group.',
      'Explain Fargate as serverless containers.',
      'Reason about the cost crossover (idle vs spiky).',
    ],
    questions: [
      'When is Lambda the wrong choice?',
      'What does an Auto Scaling Group do?',
      'What does Fargate remove compared to ECS on EC2?',
    ],
    checklist: [
      'Choose compute for three workload shapes.',
      'Explain AMI/user data/ASG.',
      'Reason about the Lambda-vs-container cost crossover.',
    ],
    interactive: {
      coldOpen:
        'A team put a high-traffic, always-on API on Lambda because "serverless is cheaper", then got a bill several times what a couple of small containers would have cost, because at constant high volume you pay for every millisecond with no idle discount. The same Lambda would have been nearly free for a bursty webhook. Compute choice is a cost-curve decision, and picking the wrong curve is expensive.',
      mental:
        'EC2 (full control, you patch) -> containers/Fargate (portable, less ops) -> Lambda (no servers, pay-per-use, scales from zero). Pick by traffic shape and the idle-vs-spiky cost curve.',
      diagram: {
        nodes: ['EC2 + ASG (full VMs)', 'ECS / Fargate (containers)', 'Lambda (functions)', 'less control -> less ops ->'],
        explanations: [
          'You manage the OS; best for steady, long-running, special-hardware workloads.',
          'Run Docker images as tasks; Fargate removes server management.',
          'Event-driven functions that scale from zero; pay per request and ms.',
          'Moving right trades control for less operational burden.',
        ],
      },
      example: {
        code: '# Same API, three cost shapes (illustrative):\nspiky webhook (1k req/day)   -> Lambda      ~free (nothing at idle)\nsteady API (sustained 500 rps) -> Fargate/EC2 cheaper than per-ms Lambda\nGPU model serving            -> EC2         (special hardware, full control)\n\n# EC2 fleet that heals and scales itself:\nAMI (image) + user data (startup script) + ASG (min/max/desired + target metric)',
        output:
          'low / spiky volume -> Lambda wins (pay nothing idle)\nhigh steady volume -> containers/EC2 win (no per-ms premium)\nspecial hardware   -> EC2\nASG -> replaces failed instances and scales to a target automatically',
        explain:
          'The workload shape picks the tier. An ASG boots instances from an AMI, configures them with user data, and keeps the desired count alive, healing failures and scaling on a metric like CPU.',
      },
      build: {
        simple: 'EC2 for control, containers for portability, Lambda for event-driven and spiky.',
        actually:
          'Lambda scales per-request with no capacity planning but has cold starts (first call after idle), a max execution time, and stateless invocations. Fargate removes node management but you still define CPU/memory per task and pay for it while running. EC2 with an ASG plus a launch template gives the cheapest steady compute and spot instances for fault-tolerant batch, at the cost of patching and capacity planning. Reserved/savings plans cut EC2/Fargate cost for predictable load.',
        breaks:
          'Lambda at high constant throughput costs far more than containers and can hit concurrency limits and downstream connection storms (each invocation opening a DB connection). Cold starts hurt latency-sensitive paths. EC2 without an ASG means a dead instance stays dead. Over-provisioned Fargate task sizes waste money silently. Putting a long, heavy job on Lambda hits the timeout; that belongs on a container or batch.',
      },
      doThisNow: [
        {
          task: 'Pick compute for three workloads and justify: (a) a webhook receiver hit a few thousand times a day, (b) a steady internal API at constant load, (c) nightly batch processing of large files.',
          reveal:
            '(a) Lambda: spiky and low volume, pays nothing at idle. (b) Fargate or EC2: constant load makes per-ms Lambda pricing lose; containers give steady, cheaper compute. (c) Batch on Fargate/EC2 (or AWS Batch) with spot instances: long-running and heavy would blow Lambda timeouts, and spot fits fault-tolerant batch cheaply.',
        },
        {
          task: 'Estimate the crossover: a request costs ~the same compute on Lambda and a small Fargate task. At what rough utilization does always-on Fargate get cheaper than per-request Lambda?',
          reveal:
            'Once the service is busy enough that a Fargate task would be utilized a large fraction of the time (roughly when sustained traffic keeps at least one task near capacity), the flat task price beats paying per-request. Lambda wins when utilization is low or bursty (long idle gaps); containers win when the box would be busy anyway. The exact point depends on request duration and pricing, so model it before committing.',
        },
      ],
      warStory:
        'A startup ran a constantly-busy core API on Lambda for simplicity and watched the bill climb to several times the cost of two small Fargate tasks, plus they kept hitting connection limits as each invocation opened a fresh database connection. Moving the steady traffic to Fargate (with a connection pool) cut cost and fixed the connection storms. Serverless is cheapest for spiky, not for always-on.',
      tweak: {
        instruction: 'A latency-sensitive API on Lambda has occasional 1-2 second first-response spikes. Name the cause and two mitigations.',
        reveal:
          'Cold starts: the first invocation after idle pays initialization. Mitigations: provisioned concurrency (keep warm instances ready), and reducing package/init weight (smaller deployment, lazy-load heavy deps). If spikes are unacceptable and traffic is steady, a container avoids cold starts entirely.',
      },
      receipt: {
        explain: [
          'EC2/ASG = control + steady cost; Fargate = portable, no node ops; Lambda = event-driven, scale-to-zero.',
          'The idle-vs-spiky cost curve, not fashion, picks the tier.',
        ],
        question: 'Your compute is chosen. How do users actually reach it: through what front door, cache, and DNS?',
      },
      recap: [
        'EC2+ASG for control/steady, containers/Fargate for portability, Lambda for spiky/event-driven.',
        'AMI = image, user data = startup script, ASG = self-healing/scaling fleet.',
        'Lambda wins at low/spiky volume; containers/EC2 win at high steady volume.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-api-layer',
    title: 'The API Layer: API Gateway, ALB, CloudFront, Route 53',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'A request travels from a browser to your code. Place Route 53, CloudFront, API Gateway, and an ALB in order and say what each one does.',
    explanation: `Between the user and your compute sits a layer that resolves names, caches, routes, and balances. The four pieces, roughly in request order: **Route 53** (DNS), **CloudFront** (CDN/edge), then either **API Gateway** or an **Application Load Balancer (ALB)** to reach your code.

**Route 53: DNS.** It turns your domain into an address and supports health checks and routing policies (latency-based, weighted, failover). It is the global front door that decides which region or endpoint a user even reaches.

**CloudFront: the edge cache.** A global CDN that caches content close to users and terminates TLS at the edge. It serves static assets fast, absorbs traffic spikes, and is the standard front for S3-hosted sites and for shielding origins.

**API Gateway vs ALB.** An **ALB** is a layer-7 load balancer that spreads HTTP traffic across targets (EC2, ECS tasks, Lambda) by path/host rules, with health checks; it is the workhorse for containerized and EC2 services. **API Gateway** is a managed API front door with built-in auth, throttling, request validation, and tight Lambda integration; it shines for serverless APIs and when you want those features without building them. Many architectures use CloudFront in front of an ALB or API Gateway.`,
    production:
      'A typical production front: Route 53 -> CloudFront -> (ALB for containers or API Gateway for Lambda) -> your service. Picking ALB vs API Gateway is mostly "do I want a managed API layer with auth/throttling (API Gateway) or a straightforward L7 balancer for long-running services (ALB)".',
    walkthrough: [
      'Order the path: Route 53 -> CloudFront -> ALB/API Gateway -> compute.',
      'Explain DNS routing policies and health checks.',
      'Use CloudFront to cache and shield the origin.',
      'Choose API Gateway vs ALB for a given service.',
    ],
    questions: [
      'What does CloudFront do that an ALB does not?',
      'When would you choose API Gateway over an ALB?',
      'What routing decisions does Route 53 make?',
    ],
    checklist: [
      'Order the four components in the request path.',
      'Explain CloudFront caching and origin shielding.',
      'Choose ALB vs API Gateway for two services.',
    ],
    interactive: {
      coldOpen:
        'A product launch goes viral and traffic 50x in an hour. One team melts because every request hammers their origin servers; another barely notices because CloudFront served 95% of it from the edge and Route 53 spread the rest. The difference was the API layer they put in front of their code before the spike, not after.',
      mental:
        'User -> Route 53 (DNS, where to go) -> CloudFront (cache at the edge) -> ALB (balance to containers/EC2) or API Gateway (managed API front for Lambda) -> your code.',
      diagram: {
        nodes: ['Browser', 'Route 53 (DNS)', 'CloudFront (edge cache)', 'ALB or API Gateway', 'Your compute'],
        explanations: [
          'Resolves your domain and makes the request.',
          'Turns the name into an address with health checks and routing policies.',
          'Caches near the user, terminates TLS, absorbs spikes, shields the origin.',
          'ALB spreads HTTP to targets; API Gateway adds auth, throttling, validation.',
          'EC2, ECS tasks, or Lambda functions that run your logic.',
        ],
      },
      example: {
        code: '# Static site + serverless API\nbrowser -> Route 53 -> CloudFront -> S3 (static assets, cached at edge)\n                              \\-> API Gateway -> Lambda -> DynamoDB\n\n# Containerized service\nbrowser -> Route 53 -> CloudFront -> ALB -> ECS/Fargate tasks (path rules)\n                                       health checks remove unhealthy tasks',
        output:
          'Route 53     -> which endpoint/region (latency, weighted, failover)\nCloudFront   -> serve cached assets at the edge; protect the origin\nAPI Gateway  -> managed front for Lambda APIs (auth, throttle, validate)\nALB          -> L7 balancing to containers/EC2 by path or host',
        explain:
          'Static assets are served from CloudFront at the edge; API calls go through API Gateway to Lambda. A containerized service swaps API Gateway for an ALB that balances across tasks and drops unhealthy ones.',
      },
      build: {
        simple: 'Route 53 finds it, CloudFront caches it, ALB/API Gateway routes it to your code.',
        actually:
          'CloudFront caches by cache key and respects cache-control headers; cache invalidation and TTLs decide freshness. ALB does host/path routing, sticky sessions, and target-group health checks, and can target Lambda too. API Gateway has two flavors (HTTP APIs are cheaper/simpler, REST APIs have more features) and built-in throttling, API keys, usage plans, and authorizers. Route 53 health checks plus failover routing give cross-region DR.',
        breaks:
          'No CloudFront (or wrong cache-control) means every request hits the origin, which falls over under a spike. API Gateway has per-account throttling and request size limits that surprise high-throughput or large-payload APIs. An ALB with a misconfigured health check drains all targets and returns 503s. DNS TTLs that are too long slow failover; too short add lookup overhead. CloudFront caching authenticated or per-user responses by mistake leaks data across users.',
      },
      doThisNow: [
        {
          task: 'Design the front for a React app with a JSON API: where do the static files live, what caches them, and what fronts the API?',
          reveal:
            'Static React build in S3, served through CloudFront (cached at the edge, cheap and fast). The API behind API Gateway (if Lambda) or an ALB (if containers), optionally also behind CloudFront. Route 53 maps the domain and can split app.example.com (CloudFront/S3) from api.example.com (API Gateway/ALB).',
        },
        {
          task: 'Choose ALB or API Gateway for: (a) a long-running containerized REST service, (b) a serverless API that needs per-client rate limits and API keys.',
          reveal:
            '(a) ALB: it balances HTTP across container tasks with health checks and no per-request API-management overhead. (b) API Gateway: built-in throttling, API keys, and usage plans give you per-client rate limits without writing them, and it integrates directly with Lambda.',
        },
      ],
      warStory:
        'A media site put its images directly on EC2 with no CDN. A front-page feature sent a traffic spike that saturated the origin and took the whole site down. Moving static assets to S3 behind CloudFront meant the next spike was served almost entirely from the edge and the origin barely noticed. A CDN is spike insurance you buy before you need it.',
      tweak: {
        instruction: 'Users in Europe report your US-hosted API is slow, even for cacheable GETs. What in the API layer would help most?',
        reveal:
          'Put CloudFront in front so cacheable responses are served from an edge location near European users instead of round-tripping to the US origin. For dynamic calls, Route 53 latency-based routing to a European deployment helps, but caching at the edge is the fastest win for GETs.',
      },
      receipt: {
        explain: [
          'Request path: Route 53 -> CloudFront -> ALB/API Gateway -> compute.',
          'CloudFront caches/shields; ALB balances containers; API Gateway is the managed serverless front.',
        ],
        question: 'Your front door serves files and data. Where do the files (uploads, assets) and the data actually live?',
      },
      recap: [
        'Route 53 = DNS + routing; CloudFront = edge cache + origin shield.',
        'ALB = L7 balancer for containers/EC2; API Gateway = managed front for serverless.',
        'Cache at the edge before a spike; mind throttles, TTLs, and health checks.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-storage',
    title: 'Storage Deep Dive: S3 vs EBS vs EFS',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Explain the difference between object, block, and file storage, and which AWS service is which.',
    explanation: `AWS has three storage shapes, and picking the wrong one is a common, expensive mistake. **S3** is object storage, **EBS** is block storage, and **EFS** is file storage.

**S3 (object storage).** Files (objects) addressed by key in buckets, accessed over HTTP, effectively unlimited, eleven-nines durability, and it is regional (replicated across AZs for you). Best for uploads, images, video, backups, logs, data-lake files, and static website assets. Store blobs here and keep only the key in your database. Storage classes (Standard, Infrequent Access, Glacier) trade retrieval speed for cost.

**EBS (block storage).** A network-attached disk you mount to a single EC2 instance, like a hard drive. It is zonal (lives in one AZ) and attaches to one instance at a time. Best for an instance boot volume and for databases running on EC2. Snapshot it to back up.

**EFS (file storage).** A shared NFS file system many instances mount at once, growing automatically. Best for shared files across a fleet and lift-and-shift apps that expect a POSIX file system. More expensive per GB than S3 or EBS; reach for it only when you truly need shared file semantics.`,
    production:
      'The number-one storage mistake is storing large blobs (images, PDFs, uploads) in a database instead of S3, which bloats the DB, slows backups, and costs far more. The rule: blobs in S3, the key (and metadata) in the database.',
    walkthrough: [
      'Distinguish object (S3), block (EBS), file (EFS).',
      'Put blobs in S3 and the key in the database.',
      'Use EBS as a single-instance disk; snapshot it.',
      'Use EFS only when you need shared file access.',
    ],
    questions: [
      'What is the difference between object and block storage?',
      'Why store uploads in S3 instead of the database?',
      'When do you need EFS instead of EBS?',
    ],
    checklist: [
      'Map object/block/file to S3/EBS/EFS.',
      'Design upload storage with S3 + a DB key.',
      'Choose between EBS and EFS for a workload.',
    ],
    interactive: {
      coldOpen:
        'A team stored user-uploaded images as binary blobs in Postgres because it was easy. A year later the database was 400 GB, backups took hours, and every query was slow, all because the actual bytes did not belong there. Moving the images to S3 and keeping only the key shrank the database 95% overnight. Where bytes live is an architecture decision, not a detail.',
      mental:
        'Three shapes: S3 (objects over HTTP, unlimited, for blobs), EBS (a disk for one EC2 instance), EFS (a shared file system for many). Blobs go in S3; the key goes in the database.',
      diagram: {
        nodes: ['S3: objects by key (HTTP)', 'EBS: disk for one instance', 'EFS: shared file system', 'DB: store the key, not the blob'],
        explanations: [
          'Unlimited object storage, regional, for uploads/assets/backups.',
          'Block device attached to a single EC2 instance (boot + data).',
          'NFS many instances mount at once; for shared files.',
          'Keep the small reference (s3 key) in the database, not the bytes.',
        ],
      },
      example: {
        code: '# Upload flow: bytes to S3, key to DB\nclient -> PUT image -> S3 bucket (key: uploads/u123/photo.jpg)\nDB row -> { id, user_id, s3_key: "uploads/u123/photo.jpg", size, type }\nserve  -> CloudFront -> S3 (or a presigned URL for private files)\n\n# Pick the shape:\nblobs / assets / backups  -> S3\none-instance disk / DB-on-EC2 -> EBS\nshared files across a fleet -> EFS',
        output:
          'S3   -> the bytes (cheap, unlimited, durable)\nDB   -> the key + metadata (small, fast to query/back up)\nEBS  -> single-instance block device\nEFS  -> shared POSIX file system (pricier; only when needed)',
        explain:
          'The image bytes go to S3; the database stores just the key and metadata. Serving goes through CloudFront or a presigned URL. The database stays small and fast.',
      },
      build: {
        simple: 'S3 for blobs, EBS for one-instance disks, EFS for shared files; key in the DB.',
        actually:
          'S3 is strongly read-after-write consistent now, supports versioning, lifecycle rules (auto-move to cheaper classes), and presigned URLs for time-limited private access. EBS volume types (gp3, io2) trade IOPS for cost and you size them up front; snapshots are incremental to S3. EFS scales throughput automatically and is multi-AZ but costs several times S3 per GB. Direct-to-S3 uploads with presigned URLs keep large files off your servers entirely.',
        breaks:
          'Blobs in the database is the classic anti-pattern (bloat, slow backups, high cost). Public S3 buckets leak data, the most common AWS misconfiguration; default to private + presigned URLs or CloudFront. Routing uploads through your app server instead of presigned direct-to-S3 wastes bandwidth and memory. EFS for something only one instance uses overpays versus EBS. Hot, frequently-read S3 data without CloudFront racks up request and transfer costs.',
      },
      doThisNow: [
        {
          task: 'Design storage for a photo-sharing app: where do the photos, the thumbnails, and the photo metadata each live, and how do private photos get served?',
          reveal:
            'Photos and thumbnails in S3 (objects, cheap and unlimited). Metadata (owner, dimensions, s3 key, privacy) in the database. Public photos served via CloudFront; private photos served via short-lived presigned S3 URLs so only authorized users get a working link. The DB never holds the bytes.',
        },
        {
          task: 'Choose EBS or EFS: (a) the data volume for a single Postgres instance on EC2, (b) a directory of shared templates read by a fleet of 20 app servers.',
          reveal:
            '(a) EBS: it is one instance, and a database wants a fast, single-attach block device. (b) EFS: many servers must read the same files simultaneously, which is exactly the shared NFS use case EBS cannot serve (EBS attaches to one instance at a time).',
        },
      ],
      warStory:
        'A SaaS stored generated PDF invoices as bytea blobs in Postgres. Backups ballooned to multi-hour jobs and a restore during an incident took so long it extended the outage. Migrating the PDFs to S3 (keys in the DB) cut backup time to minutes. Large bytes in a relational database punish you exactly when you can least afford it: during recovery.',
      tweak: {
        instruction: 'A teammate wants to make an S3 bucket public so the app can show user uploads. Give a safer way to serve private files.',
        reveal:
          'Keep the bucket private and serve files through CloudFront (with signed URLs/cookies) or generate short-lived presigned S3 URLs per request. Both give authorized users a working link without exposing the whole bucket to the internet.',
      },
      receipt: {
        explain: [
          'S3 = objects (blobs), EBS = one-instance disk, EFS = shared file system.',
          'Store bytes in S3, the key in the database; keep buckets private.',
        ],
        question: 'Files live in S3, but the structured data needs queries, joins, and transactions. Which database fits which need?',
      },
      recap: [
        'Object (S3) vs block (EBS) vs file (EFS); blobs go in S3.',
        'Keep the S3 key in the DB, not the bytes; default buckets to private.',
        'EBS attaches to one instance; EFS is shared; EFS costs more.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-databases',
    title: 'Database Deep Dive: RDS/Aurora vs DynamoDB vs ElastiCache',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 15,
    prompt: 'Choose between RDS/Aurora, DynamoDB, and ElastiCache for a workload, and explain multi-AZ and read replicas.',
    explanation: `AWS data stores split by data shape and access pattern: **RDS/Aurora** (managed relational SQL), **DynamoDB** (managed NoSQL key-value/document), and **ElastiCache** (in-memory cache). Choosing well is mostly about your queries.

**RDS / Aurora (relational).** Managed Postgres/MySQL (RDS) or AWS's cloud-native, faster, auto-scaling-storage variant (Aurora). Pick this when you have relationships, need joins, transactions, and ad hoc queries, or are unsure (relational is the safe default). **Multi-AZ** keeps a synchronous standby in another AZ for automatic failover; **read replicas** offload read traffic to extra copies (asynchronous, eventually consistent).

**DynamoDB (NoSQL).** A fully managed key-value/document store with single-digit-millisecond latency at any scale and no servers. Pick it when you know your access patterns up front, need massive scale and predictable latency, and can model around keys (not joins). It punishes you if you need flexible, relational queries.

**ElastiCache (in-memory).** Managed Redis or Memcached, microsecond reads, for caching hot data and reducing database load (cache-aside), sessions, rate limiters, and leaderboards. It is a complement, not a primary store; data is volatile.

**The decision.** Relationships and flexible queries -> RDS/Aurora. Known key-based access at huge scale -> DynamoDB. Hot reads to protect the database -> add ElastiCache in front.`,
    production:
      'Most apps start on RDS/Aurora (relational is forgiving of unknown query patterns), add ElastiCache when reads get hot, and reach for DynamoDB for specific high-scale, key-access workloads. Multi-AZ for the primary database is table stakes for production; running a single-AZ database is an outage waiting for an AZ to blink.',
    walkthrough: [
      'Match data shape to RDS/Aurora, DynamoDB, or ElastiCache.',
      'Explain multi-AZ failover vs read replicas.',
      'Add ElastiCache with cache-aside for hot reads.',
      'Reason about when DynamoDB beats relational.',
    ],
    questions: [
      'When is DynamoDB the wrong choice?',
      'What is the difference between multi-AZ and a read replica?',
      'What problem does ElastiCache solve?',
    ],
    checklist: [
      'Choose a data store for three workloads.',
      'Explain multi-AZ and read replicas.',
      'Design cache-aside for a hot read path.',
    ],
    interactive: {
      coldOpen:
        'A team chose DynamoDB for a new app because "it scales", then spent months fighting it the moment product wanted a new report that needed a join DynamoDB cannot do. They rebuilt on Postgres. DynamoDB is superb when you know your access patterns and brutal when you do not. The database choice you make on day one is the one you live with under pressure.',
      mental:
        'Relationships and flexible queries -> RDS/Aurora (the safe default). Known key access at huge scale -> DynamoDB. Hot reads slamming the DB -> put ElastiCache in front.',
      diagram: {
        nodes: ['App', 'ElastiCache (hot reads)', 'RDS/Aurora (relational, primary)', 'Read replicas (scale reads)', 'DynamoDB (key access, scale)'],
        explanations: [
          'Reads check the cache first (cache-aside).',
          'In-memory cache absorbs repeated hot reads, protecting the database.',
          'The relational primary; multi-AZ standby for failover.',
          'Asynchronous read-only copies that offload heavy read traffic.',
          'A separate path for workloads that fit key-based access at scale.',
        ],
      },
      example: {
        code: '# Cache-aside read path\nGET item:\n  hit cache?  -> return it (microseconds)\n  miss        -> read RDS/Aurora -> write to cache (TTL) -> return\n\n# Relational vs NoSQL fit\njoins, transactions, ad hoc queries, unsure -> RDS/Aurora\nknown key lookups, millions of ops, predictable latency -> DynamoDB\n\n# Reliability\nmulti-AZ  -> synchronous standby, auto-failover (availability)\nread replica -> async copy, offload reads (scale, eventually consistent)',
        output:
          'cache hit  -> fastest, no DB load\ncache miss -> DB read then populate cache\nmulti-AZ   -> survive an AZ failure (HA), not for scaling reads\nread replica -> scale reads, slightly stale data',
        explain:
          'Cache-aside checks ElastiCache first and only hits the database on a miss. Multi-AZ is for availability (a standby that takes over); read replicas are for read scale (extra copies you query), and they can lag.',
      },
      build: {
        simple: 'RDS/Aurora for relational, DynamoDB for key access at scale, ElastiCache for hot reads.',
        actually:
          'Aurora separates compute from storage, replicates six ways across three AZs, and fails over fast; RDS is the standard managed engines. Multi-AZ is synchronous (no data loss on failover) but does not serve reads; read replicas are asynchronous and can be promoted. DynamoDB charges by capacity (on-demand or provisioned) and rewards single-table design around access patterns; a global secondary index adds a query pattern at a cost. ElastiCache (Redis) adds persistence options, pub/sub, and data structures beyond plain caching.',
        breaks:
          'DynamoDB with the wrong key design forces expensive scans or many GSIs, and it cannot do ad hoc joins, so unknown future queries hurt. A single-AZ database is an outage on any AZ blip. Read replicas serving reads that must be fresh expose replication lag bugs. A cache with no TTL or no invalidation serves stale data; a cache that everything depends on becomes a single point of failure (a thundering herd on cache loss can crush the DB). Storing the cache as the source of truth loses data on eviction.',
      },
      doThisNow: [
        {
          task: 'Pick a data store for: (a) an e-commerce app with orders, products, and customers that needs reports, (b) a session store for millions of users keyed by session id, (c) a leaderboard updated constantly and read constantly.',
          reveal:
            '(a) RDS/Aurora: relationships, transactions, and ad hoc reporting are exactly relational strengths. (b) DynamoDB (or ElastiCache): pure key lookups at huge scale with predictable latency. (c) ElastiCache (Redis sorted sets): in-memory, purpose-built for ranking with microsecond reads and writes.',
        },
        {
          task: 'Design cache-aside for a product-detail endpoint hit 10,000 times a second for a few hundred hot products. Specify the key, the TTL, and what happens on a miss and on an update.',
          reveal:
            'Key: product:{id}. On read: check cache; on miss, read the DB, write the value with a TTL (say 60s), return it. On product update: write the DB then delete (or overwrite) the cache key so the next read repopulates. TTL bounds staleness; explicit invalidation on writes keeps it fresh. This turns 10k DB reads/s into a trickle.',
        },
      ],
      warStory:
        'A viral feature caused a cache flush, and every one of thousands of simultaneous requests missed the cache and hit the database at once, a thundering herd that took the database down and the cache could not refill because the DB was overwhelmed. Adding a short lock/single-flight on cache repopulation and staggered TTLs prevented a repeat. A cache everything leans on must be designed for the moment it is empty.',
      tweak: {
        instruction: 'A read replica is serving a user their own just-submitted comment, but it sometimes shows as missing. Why, and one fix?',
        reveal:
          'Replication lag: replicas are asynchronous, so a read right after a write may hit a replica that has not caught up. Fix by reading the user own recent writes from the primary (read-your-writes), or route post-write reads to the primary for a short window.',
      },
      receipt: {
        explain: [
          'RDS/Aurora for relational (safe default), DynamoDB for key access at scale, ElastiCache for hot reads.',
          'Multi-AZ = availability (failover); read replicas = read scale (can lag).',
        ],
        question: 'Synchronous calls between services break under load. How do you decouple producers and consumers so a spike does not cascade?',
      },
      recap: [
        'Relational + flexible queries -> RDS/Aurora; known key access at scale -> DynamoDB.',
        'ElastiCache (cache-aside) absorbs hot reads; design for the empty-cache moment.',
        'Multi-AZ is for failover; read replicas are for read scale and can lag.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-messaging',
    title: 'Messaging and Eventing: SQS, SNS, EventBridge, Kinesis',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 15,
    prompt: 'Explain why synchronous calls break under load, how SQS decouples producers and consumers, and when you would reach for SNS, EventBridge, or Kinesis instead.',
    explanation: `When one service calls another directly and synchronously, a slow or failed consumer backs up the producer, and a traffic spike cascades into a pile-up. Messaging breaks that coupling. The four AWS tools: **SQS** (queues), **SNS** (pub/sub fanout), **EventBridge** (event bus with routing), and **Kinesis** (streaming).

**SQS (queue, one consumer group).** Producers put messages on a queue; workers pull them at their own pace. This decouples and buffers: a spike fills the queue instead of crushing the worker, and the worker scales to drain it. **Standard** queues are high-throughput, at-least-once (possible duplicates, no strict order); **FIFO** queues guarantee order and exactly-once processing at lower throughput. A **visibility timeout** hides a message while a worker processes it; if the worker fails to delete it in time, it reappears for retry. After N failures a message goes to a **dead-letter queue (DLQ)** so a poison message does not loop forever.

**SNS (pub/sub, many subscribers).** One message fanned out to many subscribers (queues, Lambdas, HTTP). Use it when several systems need the same event. The classic pattern is SNS -> multiple SQS queues (fanout with per-consumer buffering).

**EventBridge (event bus + routing).** A managed bus where producers emit events and rules route them to targets by content, with schemas and third-party SaaS sources. Use it for event-driven architectures where routing and decoupling by event type matter.

**Kinesis (streaming).** An ordered, replayable stream for high-volume real-time data (clickstreams, metrics, logs) where multiple consumers read at their own offset and you need ordering and replay. Use it for analytics-style firehoses, not simple task queues.`,
    production:
      'The single most common resilience upgrade is turning a synchronous "do it now and make the user wait" call into "accept it, queue it, process asynchronously, notify when done". SQS with a DLQ and idempotent consumers is the backbone of reliable job processing on AWS.',
    walkthrough: [
      'Explain how synchronous coupling cascades under load.',
      'Decouple with SQS; explain visibility timeout, DLQ, retries.',
      'Choose SQS vs SNS vs EventBridge vs Kinesis.',
      'Design idempotent consumers and backpressure.',
    ],
    questions: [
      'What does a visibility timeout do?',
      'What is a dead-letter queue for?',
      'When would you use SNS or EventBridge instead of SQS?',
    ],
    checklist: [
      'Explain queue decoupling and buffering.',
      'Design retry + DLQ + idempotency.',
      'Choose the right messaging service for a case.',
    ],
    interactive: {
      coldOpen:
        'A user uploads a photo and your API tries to resize it, run ML tagging, and email them, all before responding. Under load the resize service slows, every request piles up waiting, threads exhaust, and the whole API falls over from one slow downstream. Put a queue between them and the upload returns instantly while a worker does the heavy lifting at its own pace. Queues are how systems stay up when one part gets slow.',
      mental:
        'Synchronous calls couple failure and load. A queue (SQS) decouples and buffers: producers enqueue, workers drain at their pace, failures retry, poison messages go to a DLQ. SNS fans out, EventBridge routes by event, Kinesis streams.',
      diagram: {
        nodes: ['API (producer)', 'SQS queue (buffer)', 'Worker (consumer, scales)', 'S3 / DynamoDB (result)', 'DLQ (after N retries)'],
        explanations: [
          'Accepts the request and enqueues a message, then returns immediately.',
          'Buffers the work; a spike fills the queue instead of crushing the worker.',
          'Pulls messages and processes them; scale workers to drain faster.',
          'The worker writes results (processed file, record).',
          'Messages that fail repeatedly land here for inspection, not an infinite loop.',
        ],
      },
      example: {
        code: '# Async upload pipeline\nPOST /upload -> save to S3 -> put {jobId, s3Key} on SQS -> return 202 jobId\nworker: receive msg (visibility timeout 5m)\n        -> resize + tag + write DynamoDB\n        -> delete msg (success)   |  fail -> reappears -> retry -> DLQ after 5\n\n# Pick the tool\none consumer, buffer work  -> SQS\none event, many consumers  -> SNS (or SNS -> many SQS)\nroute events by type/content -> EventBridge\nordered, replayable firehose -> Kinesis',
        output:
          '202 + jobId  -> user is not blocked on processing\nvisibility timeout -> message hidden while a worker has it\ndelete on success / reappear on failure -> automatic retry\nDLQ after N -> a poison message stops looping',
        explain:
          'The upload returns a job id immediately; a worker processes asynchronously. The visibility timeout hides the message during processing; success deletes it, failure lets it reappear, and repeated failures divert it to the DLQ.',
      },
      build: {
        simple: 'A queue decouples producer and consumer; retries + DLQ make it reliable.',
        actually:
          'Standard SQS is at-least-once, so consumers must be idempotent (use an idempotency key to skip duplicate processing). The visibility timeout must exceed your processing time or a message gets picked up twice. DLQ depth and age are alarm-worthy signals of a broken consumer. Backpressure is natural: queue depth tells you to scale workers. SNS+SQS fanout gives each consumer its own buffer; EventBridge adds content-based routing and schemas; Kinesis preserves order per shard and lets consumers replay from an offset.',
        breaks:
          'Non-idempotent consumers double-charge or double-send on the inevitable duplicate. A visibility timeout shorter than processing time causes a second worker to grab the same message (duplicate work). No DLQ means a poison message retries forever, blocking the queue. FIFO throughput limits surprise teams who pick it for ordering without needing it. Kinesis hot shards throttle; SQS is simpler unless you genuinely need ordering and replay.',
      },
      doThisNow: [
        {
          task: 'Design the async pipeline for "user uploads image -> process -> notify": the message shape, the retry policy, DLQ behavior, and the idempotency key.',
          reveal:
            'Message: { jobId, userId, s3Key, requestedAt }. Worker processes (resize/tag), writes the result, then deletes the message. Retry: visibility timeout > processing time; up to 5 receives, then DLQ. Idempotency key: jobId (store processed jobIds, or make the write itself idempotent) so a redelivered message does not reprocess or double-notify. Notify via SNS on success. The user got a 202 immediately.',
        },
        {
          task: 'Choose the messaging service: (a) when an order is placed, three teams (inventory, email, analytics) all need to know; (b) a clickstream of millions of events per minute that analytics replays.',
          reveal:
            '(a) SNS (often SNS -> three SQS queues): one event fanned out to many consumers, each with its own buffer and retry. (b) Kinesis: high-volume, ordered, replayable streaming where multiple consumers read at their own offset. SQS alone fits neither well: it is single-consumer-group and not built for replay.',
        },
      ],
      warStory:
        'A payments worker pulled from a standard SQS queue but was not idempotent, and a visibility timeout shorter than its processing time meant a slow message got delivered twice, charging some customers twice. Adding an idempotency key (skip if this payment id was already processed) and lengthening the visibility timeout fixed it. At-least-once delivery is a promise you must design for, not a bug.',
      tweak: {
        instruction: 'Messages in your queue are being processed twice. Name the two most likely causes and the durable fix.',
        reveal:
          'Either the visibility timeout is shorter than processing time (a second worker grabs it) or the consumer is not idempotent (a legitimate at-least-once redelivery reprocesses). Fix: set the visibility timeout above worst-case processing time, and make the consumer idempotent with an idempotency key so duplicates are no-ops.',
      },
      receipt: {
        explain: [
          'A queue decouples and buffers; visibility timeout + retries + DLQ make it reliable.',
          'SQS = one consumer group, SNS = fanout, EventBridge = routing, Kinesis = streaming.',
        ],
        question: 'Your async system has many moving parts. When something breaks at 3am, how do you see what happened?',
      },
      recap: [
        'Synchronous coupling cascades; a queue decouples and buffers spikes.',
        'Standard SQS is at-least-once: make consumers idempotent; use a DLQ.',
        'SQS (queue), SNS (fanout), EventBridge (routing), Kinesis (streaming).',
      ],
    },
  },

  {
    id: 'aws-rung-deep-observability',
    title: 'Observability: CloudWatch Logs, Metrics, Alarms, X-Ray, CloudTrail',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'When production breaks at 3am, name the AWS tools that answer "what is happening", "is it bad enough to wake someone", "where is the slow part", and "who changed what".',
    explanation: `You cannot fix what you cannot see. AWS observability has four pillars: **CloudWatch Logs** (what happened), **CloudWatch Metrics + Alarms** (is it bad, page someone), **X-Ray** (where in a request the time or error went), and **CloudTrail** (who called which AWS API).

**Logs.** Services and your app write log lines to CloudWatch Logs (grouped by log group). You search them, set metric filters (turn a log pattern into a metric), and retain or export them. This is the narrative of what the system did.

**Metrics and alarms.** CloudWatch collects numeric time series (CPU, latency, error count, queue depth). An **alarm** watches a metric against a threshold and triggers (notify via SNS, page on-call, or auto-scale). The art is alerting on symptoms users feel (error rate, p99 latency, queue age), not noisy internals.

**X-Ray (tracing).** Follows a single request across services and shows a timeline: which call was slow, which threw, where the latency went. Essential once a request fans out across Lambda, queues, and databases.

**CloudTrail (audit).** Records every AWS API call (who, what, when, from where). It answers "who deleted the bucket" and "what changed right before the incident", and it is a core security and forensics tool.`,
    production:
      'The 3am drill: an alarm pages on a symptom (error rate up), you read CloudWatch Logs for the error, X-Ray shows which downstream call broke, and CloudTrail shows whether a recent change caused it. Teams without this guess; teams with it diagnose. Alert on what users feel, not on CPU.',
    walkthrough: [
      'Read logs in CloudWatch Logs.',
      'Set an alarm on a user-facing metric via SNS.',
      'Trace a slow request with X-Ray.',
      'Find who changed what with CloudTrail.',
    ],
    questions: [
      'What is the difference between metrics and logs?',
      'What should you alarm on, and what should you not?',
      'What question does CloudTrail answer?',
    ],
    checklist: [
      'Find an error in CloudWatch Logs.',
      'Design a symptom-based alarm.',
      'Use X-Ray and CloudTrail for an incident.',
    ],
    interactive: {
      coldOpen:
        'Checkout is failing and customers are tweeting, but your dashboard of CPU graphs is all green, because CPU was never the problem. The team that alarms on error rate and p99 latency got paged ten minutes ago and is already reading the exact error in their logs. Observability is not dashboards; it is being told the right thing at the right time and being able to answer "why" fast.',
      mental:
        'Four pillars: Logs (what happened), Metrics+Alarms (is it bad, page someone), X-Ray (where the time/error went), CloudTrail (who changed what). Alarm on symptoms users feel.',
      diagram: {
        nodes: ['Metrics + Alarm (symptom)', 'Page on-call (SNS)', 'CloudWatch Logs (what)', 'X-Ray (where)', 'CloudTrail (who changed what)'],
        explanations: [
          'A user-facing metric (error rate, p99, queue age) crosses a threshold.',
          'The alarm notifies via SNS and pages the on-call engineer.',
          'Read the logs for the actual error message and context.',
          'Trace the slow/failing request across services to the culprit call.',
          'Check what AWS changes happened right before the incident.',
        ],
      },
      example: {
        code: '# Alarm on a symptom, not an internal\nALARM: 5xx error rate > 1% for 5 min   -> SNS -> page on-call   (good)\nALARM: CPU > 80%                       -> often noise           (weak)\n\n# Incident flow\nlogs:       aws logs tail /my/app --since 15m | grep -i error\nmetric:     ApplicationELB 5xx count, p99 TargetResponseTime\ntrace:      X-Ray -> request spent 4s in the DynamoDB call\naudit:      CloudTrail -> a security-group change 12 min before',
        output:
          'metric + alarm -> tells you SOMETHING is wrong (symptom)\nlogs           -> tells you WHAT the error is\nX-Ray          -> tells you WHERE the time/error went\nCloudTrail     -> tells you WHO/WHAT changed before it broke',
        explain:
          'The alarm fires on a user-facing symptom and pages someone; logs give the error text; X-Ray localizes the slow call; CloudTrail reveals the change that triggered it. Four tools, four different questions.',
      },
      build: {
        simple: 'Logs say what, metrics+alarms say if it is bad, X-Ray says where, CloudTrail says who.',
        actually:
          'CloudWatch metric filters turn a log pattern (like "OutOfMemory") into a metric you can alarm on. Alarms support composite conditions and can trigger auto-scaling or remediation, not just notifications. X-Ray needs instrumentation (SDK or service integration) to capture segments. CloudTrail logs management events by default; data events (S3 object reads) are opt-in and voluminous. Structured (JSON) logs make searching and metric filters far more reliable than free text.',
        breaks:
          'Alerting on internals (CPU, memory) instead of symptoms creates alarm fatigue and misses real user pain. No alarms means you learn of outages from customers. Logs with no structure or no retention are useless during an incident or absent afterward. CloudTrail not enabled (or not centralized) leaves you blind in a forensic investigation. X-Ray sampling too low misses the rare slow request you most need to see.',
      },
      doThisNow: [
        {
          task: 'Design the alarms for a checkout API. List three you would page on and one you would not, with the reason.',
          reveal:
            'Page on: 5xx error rate above ~1% (users see failures), p99 latency above your SLO (users feel slowness), and payment-queue age growing (orders stuck). Do not page on: CPU above 80% alone, because high CPU with healthy latency and errors is fine, and it generates noise. Alarm on symptoms the user experiences, not on internals.',
        },
        {
          task: 'Walk the incident: checkout 5xx just spiked. In what order do you use logs, metrics, X-Ray, and CloudTrail, and what is each one for?',
          reveal:
            'Confirm with the metric (5xx rate, p99) that it is real and how bad. Read CloudWatch Logs for the actual error. Use X-Ray to see which downstream call (DB, payment API) is slow or failing. Check CloudTrail for a config or deploy change just before the spike. Symptom -> what -> where -> who. Then fix or roll back the change.',
        },
      ],
      warStory:
        'A team only alarmed on CPU and memory. A bad deploy made every checkout return 500 while CPU stayed low, so no alarm fired and they found out from angry customers an hour later. Adding a 5xx-error-rate alarm meant the next bad deploy paged them in five minutes, before most users noticed. Alarm on what users feel, or you will hear it from them first.',
      tweak: {
        instruction: 'Your on-call is drowning in alarms and starting to ignore them. What is the likely cause and the fix?',
        reveal:
          'Alarm fatigue from alerting on internal metrics (CPU/memory) and non-actionable thresholds. Fix: page only on user-facing symptoms (error rate, latency SLO, stuck queues) that require human action, and downgrade the rest to dashboards. Fewer, meaningful pages restore trust in the alarm.',
      },
      receipt: {
        explain: [
          'Logs (what), metrics+alarms (is it bad), X-Ray (where), CloudTrail (who changed what).',
          'Alarm on symptoms users feel; structured logs and enabled CloudTrail save the incident.',
        ],
        question: 'You can see incidents now. How do you keep the secrets and keys your app needs out of the code and logs in the first place?',
      },
      recap: [
        'CloudWatch Logs = what happened; Metrics+Alarms = is it bad, page someone.',
        'X-Ray traces where a request slowed/failed; CloudTrail audits who changed what.',
        'Alarm on user-facing symptoms, not internal CPU/memory.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-security',
    title: 'Security: KMS, Secrets Manager, Parameter Store, WAF, Shield',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Name where an app secret (a DB password) should live instead of the code, how data gets encrypted at rest, and what protects the edge from attacks.',
    explanation: `Beyond IAM and networking, a few services handle secrets, encryption, and edge protection: **KMS** (encryption keys), **Secrets Manager** and **Parameter Store** (configuration and secrets), and **WAF** and **Shield** (edge defense).

**KMS (key management).** Creates and controls encryption keys and integrates with most services so data is encrypted at rest with one checkbox (S3, EBS, RDS, etc.). It never exposes the raw key; you ask KMS to encrypt/decrypt, and access is governed by IAM and key policies. Envelope encryption (KMS encrypts a data key that encrypts your data) is the standard pattern.

**Secrets Manager vs Parameter Store.** Both store configuration outside your code. **Secrets Manager** is built for secrets (DB passwords, API keys) with automatic rotation, at a per-secret cost. **Parameter Store** (SSM) stores config and secrets (SecureString, encrypted with KMS) and is free for standard parameters, a great fit for non-rotating config. The rule: secrets out of code and out of environment-variable sprawl, fetched at runtime with an IAM-scoped role.

**WAF and Shield (edge defense).** **WAF** is a web application firewall (rules against SQL injection, XSS, bad bots, rate-based blocking) you attach to CloudFront, ALB, or API Gateway. **Shield** protects against DDoS (Standard is automatic and free; Advanced adds higher-tier protection and support). They defend the front door so attacks do not reach your origin.`,
    production:
      'Secrets belong in Secrets Manager or Parameter Store, never in code, env files, or logs, and are fetched at runtime via an IAM role. Encryption at rest via KMS is usually a one-click default. WAF in front of public endpoints blocks the common automated attacks before they touch your app.',
    walkthrough: [
      'Move a DB password out of code into Secrets Manager/Parameter Store.',
      'Encrypt data at rest with KMS (envelope encryption).',
      'Choose Secrets Manager vs Parameter Store.',
      'Attach WAF and rely on Shield at the edge.',
    ],
    questions: [
      'Where should a database password live, and how does the app get it?',
      'What is the difference between Secrets Manager and Parameter Store?',
      'What does WAF protect against?',
    ],
    checklist: [
      'Store and fetch a secret without hardcoding.',
      'Explain KMS envelope encryption.',
      'Place WAF/Shield at the edge.',
    ],
    interactive: {
      coldOpen:
        'A database password sits in a config file, the config file gets committed, the repo later goes public for a day, and now an attacker has your production database. The password should never have been in the code at all: it should live in Secrets Manager and be fetched at runtime by an IAM-scoped role, with nothing sensitive on disk. Secret handling is the difference between a near-miss and a breach.',
      mental:
        'Secrets out of code into Secrets Manager / Parameter Store (fetched via an IAM role). KMS encrypts data at rest. WAF + Shield defend the edge before attacks reach your app.',
      diagram: {
        nodes: ['App (no secrets in code)', 'IAM role -> fetch at runtime', 'Secrets Manager / Parameter Store', 'KMS (encrypts at rest)', 'WAF + Shield (edge defense)'],
        explanations: [
          'The code contains no passwords or keys, only references.',
          'A scoped IAM role lets the app retrieve the secret at startup/runtime.',
          'The secret store holds DB passwords and config, encrypted with KMS.',
          'Keys that encrypt S3/EBS/RDS data and the secrets themselves.',
          'WAF filters malicious requests; Shield absorbs DDoS at the front door.',
        ],
      },
      example: {
        code: '# Bad: secret in code / env file committed to git\nDB_PASSWORD = "hunter2"            # leaks the moment the repo does\n\n# Good: fetched at runtime via an IAM-scoped role\nsecret = secretsmanager.get_secret_value(SecretId="prod/db")  # role-gated\n\n# Pick the store\nrotating secret (DB password, API key) -> Secrets Manager (auto-rotation)\nnon-rotating config / cheap secrets    -> Parameter Store (SecureString)\n\n# Edge\nWAF rules on CloudFront/ALB/API GW -> block SQLi/XSS/bad bots/rate abuse\nShield -> absorb DDoS',
        output:
          'in code   -> one repo leak = full compromise\nat runtime via role -> nothing sensitive on disk or in git\nSecrets Manager -> rotation built in (pricier)\nParameter Store -> free standard params (great for config)',
        explain:
          'The secret is fetched at runtime by a role-gated call, so it never sits in code or git. Secrets Manager rotates; Parameter Store is the cheap default for config. WAF and Shield keep attacks off the origin.',
      },
      build: {
        simple: 'Secrets in Secrets Manager/Parameter Store (not code); KMS encrypts at rest; WAF/Shield guard the edge.',
        actually:
          'KMS uses envelope encryption: a customer master key encrypts per-object data keys, so you rotate the master key without re-encrypting everything, and access is gated by both IAM and the key policy. Secrets Manager rotation can call a Lambda to change the password in the DB and the secret together. Parameter Store SecureString uses KMS too. WAF supports managed rule groups (OWASP-style) plus rate-based rules; Shield Standard is automatic, Advanced is paid with a response team.',
        breaks:
          'Secrets in environment variables can leak via logs, error dumps, or a process listing; fetching at runtime and avoiding logging them is safer. Hardcoded or committed secrets are the classic breach. Not encrypting RDS/EBS at creation means you cannot turn it on later without a rebuild. WAF rules that are too aggressive block real users (false positives); too loose and they do nothing. Over-broad KMS key policies let the wrong roles decrypt everything.',
      },
      doThisNow: [
        {
          task: 'Take an app with DB_PASSWORD in an env file. Redesign how the password is stored, who can read it, and how the app gets it at runtime.',
          reveal:
            'Store the password in Secrets Manager (or Parameter Store SecureString) encrypted with KMS. Grant the app role secretsmanager:GetSecretValue on that one secret ARN only. The app fetches it at startup (or caches briefly), never logs it, and keeps nothing in code or git. Rotation (if used) updates the DB and the secret together via a rotation Lambda.',
        },
        {
          task: 'Choose the store for each: (a) a database password you want rotated every 30 days, (b) a feature-flag config value, (c) a third-party API key that rarely changes.',
          reveal:
            '(a) Secrets Manager: built-in rotation is exactly its purpose. (b) Parameter Store (standard, free) for plain config. (c) Parameter Store SecureString (KMS-encrypted) is fine and cheaper if no rotation is needed; Secrets Manager if you want rotation later. Match the tool to whether you need rotation and how cost-sensitive you are.',
        },
      ],
      warStory:
        'A company committed AWS and database credentials into a private repo that was later briefly made public during a migration. Bots scraped it within minutes and accessed the database. Had the secrets lived in Secrets Manager behind an IAM role, the repo would have contained nothing to steal. The cheapest breach prevention is making sure secrets are never in the code to begin with.',
      tweak: {
        instruction: 'A teammate puts secrets in Lambda environment variables "because it is easy". Give one risk and a better default.',
        reveal:
          'Env vars can leak via logs, error traces, or anyone with read access to the function config, and they are not rotated. Better: store the secret in Secrets Manager/Parameter Store and fetch it at runtime with the function execution role scoped to that one secret.',
      },
      receipt: {
        explain: [
          'Secrets live in Secrets Manager/Parameter Store, fetched at runtime via an IAM role.',
          'KMS encrypts data at rest (envelope encryption); WAF/Shield defend the edge.',
        ],
        question: 'You can secure an app, but how do you build all this infrastructure repeatably instead of clicking in the console?',
      },
      recap: [
        'Secrets out of code into Secrets Manager (rotating) or Parameter Store (config).',
        'KMS encrypts at rest via envelope encryption, gated by IAM + key policy.',
        'WAF blocks app-layer attacks; Shield absorbs DDoS at the edge.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-iac',
    title: 'Deployment and IaC: CloudFormation, CDK, CodePipeline',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 12,
    prompt: 'Explain why clicking in the console does not scale, what infrastructure-as-code gives you, and the difference between CloudFormation and CDK.',
    explanation: `Building infrastructure by clicking in the console is unrepeatable, undocumented, and impossible to review. **Infrastructure as code (IaC)** declares your infrastructure in files you version, review, and apply, and a **deployment pipeline** ships your application the same disciplined way.

**CloudFormation (declarative templates).** You write a template (JSON/YAML) describing the resources you want; CloudFormation creates, updates, and deletes them as a **stack**, tracking state and rolling back on failure. It is the AWS-native foundation: repeatable, reviewable, and the same in every environment.

**CDK (code that generates templates).** The Cloud Development Kit lets you define infrastructure in a real programming language (TypeScript, Python) with loops, types, and reusable constructs; it synthesizes CloudFormation under the hood. Best when you want abstraction and to share infra patterns as code. Terraform is a popular multi-cloud alternative with the same declarative philosophy.

**CodePipeline / CodeBuild / CodeDeploy.** A pipeline automates build-test-deploy: **CodeBuild** builds and tests, **CodeDeploy** rolls out (with strategies like blue/green or canary), and **CodePipeline** orchestrates the stages on every commit. The goal: every change goes through the same automated, reviewable path, so deploys are boring and rollbacks are easy.`,
    production:
      'Reproducible environments come from IaC, not from memory or a wiki of console steps. Define infrastructure in CloudFormation/CDK/Terraform, review it like code, and ship application changes through a pipeline with automated tests and a safe rollout strategy. "It works because someone clicked the right things once" is how environments drift and incidents happen.',
    walkthrough: [
      'Explain why console-clicking does not scale.',
      'Declare infrastructure as a CloudFormation stack.',
      'Use CDK to generate templates from real code.',
      'Automate build-test-deploy with a pipeline.',
    ],
    questions: [
      'What does infrastructure-as-code give you over console clicks?',
      'What is the difference between CloudFormation and CDK?',
      'What does a deployment pipeline automate?',
    ],
    checklist: [
      'Explain IaC benefits (repeatable, reviewable).',
      'Contrast CloudFormation and CDK.',
      'Outline a build-test-deploy pipeline.',
    ],
    interactive: {
      coldOpen:
        'Production works, but nobody can recreate it: it was built by clicking around the console over months, and the one person who remembers the steps just left. Staging does not match prod, a rebuild is terrifying, and every change is a manual gamble. Infrastructure as code turns that fragile memory into reviewed, repeatable files. The console is for looking; code is for building.',
      mental:
        'Declare infrastructure in code (CloudFormation/CDK/Terraform) so it is repeatable and reviewable, and ship app changes through an automated build-test-deploy pipeline.',
      diagram: {
        nodes: ['Infra as code (CloudFormation/CDK)', 'Reviewed + versioned', 'Deploy: same in every env', 'CodePipeline: build -> test -> deploy', 'Safe rollout + rollback'],
        explanations: [
          'Resources declared in templates or CDK code, not clicked.',
          'Changes go through pull request review and live in git history.',
          'Applying the same definition gives identical dev/staging/prod.',
          'Every commit runs build, tests, and a controlled deploy.',
          'Blue/green or canary rollouts make rollback fast and boring.',
        ],
      },
      example: {
        code: '# CloudFormation (declarative): describe the resource, AWS reconciles it\nResources:\n  UploadsBucket:\n    Type: AWS::S3::Bucket\n    Properties: { BucketName: app-uploads, VersioningConfiguration: { Status: Enabled } }\n\n# CDK (real code -> synthesizes CloudFormation)\nnew s3.Bucket(this, "Uploads", { versioned: true })\n\n# Pipeline on every commit\ncommit -> CodeBuild (build + test) -> CodeDeploy (blue/green) -> CodePipeline orchestrates',
        output:
          'CloudFormation -> declare desired state; stack tracks + rolls back\nCDK            -> loops, types, reusable constructs -> CloudFormation\npipeline       -> build, test, deploy automatically per commit\nblue/green     -> shift traffic gradually; roll back fast',
        explain:
          'CloudFormation declares the bucket; CDK expresses the same in code and synthesizes the template. The pipeline turns every commit into a tested, controlled deploy with an easy rollback.',
      },
      build: {
        simple: 'Declare infra as code (repeatable, reviewable); ship app changes through a pipeline.',
        actually:
          'CloudFormation tracks a stack state and does change sets (a preview of what an update will alter) and automatic rollback on failure. CDK adds programming-language power and high-level constructs but you still review the synthesized template for surprises. Terraform is multi-cloud with its own state file (which must be stored and locked carefully). Pipelines add manual approval gates for prod, automated tests as a gate, and rollout strategies (canary shifts a small percentage first) so a bad deploy is caught before full exposure.',
        breaks:
          'Mixing console clicks with IaC causes drift: the template no longer matches reality, and the next deploy fights or overwrites manual changes. A CloudFormation update that fails mid-way can leave a stack in a stuck state needing manual intervention. Terraform state file loss or concurrent edits corrupt your view of the world. A pipeline with no tests just automates shipping bugs faster; the tests are the point. No rollback strategy turns a bad deploy into a long outage.',
      },
      doThisNow: [
        {
          task: 'List three things you can do with infrastructure-as-code that you cannot do with console clicking, and why each matters.',
          reveal:
            'Code-review infrastructure changes in a pull request (catch mistakes before they apply); recreate an identical environment on demand (disaster recovery, new region, matching staging to prod); and see the full history of who changed what and when (audit and rollback). Console clicks give you none of these: no review, no reproducibility, no history.',
        },
        {
          task: 'Outline the pipeline for a containerized service: what runs on each commit from push to production, including a safety gate.',
          reveal:
            'Push -> CodeBuild builds the Docker image and runs unit/integration tests (gate: fail the pipeline if tests fail) -> push image to ECR -> deploy to staging -> automated smoke tests -> manual approval gate for prod -> CodeDeploy blue/green to prod (shift traffic gradually, auto-rollback on alarms). Every change takes the same tested path; a bad build never reaches prod.',
        },
      ],
      warStory:
        'A company built prod entirely by hand in the console. When they needed an identical environment in a new region for a big customer, it took weeks of guesswork and still did not match, causing subtle bugs. After that they codified everything in CDK; the next region was a parameter change and an apply. IaC is what turns "recreate prod" from a project into a command.',
      tweak: {
        instruction: 'Your CloudFormation deploys keep getting overwritten or fighting manual changes someone made in the console. What is happening and the fix?',
        reveal:
          'Drift: someone changed resources in the console, so the live state no longer matches the template, and the next deploy reverts or conflicts with those changes. Fix: make all changes through IaC (no console edits to managed resources), and use drift detection to catch and reconcile anything that slipped through.',
      },
      receipt: {
        explain: [
          'IaC makes infrastructure repeatable, reviewable, and recreatable; the console is for inspection.',
          'CloudFormation declares stacks; CDK generates them from code; pipelines automate build-test-deploy.',
        ],
        question: 'You can build and ship infrastructure. How do these services compose into the standard serverless and container architectures?',
      },
      recap: [
        'IaC (CloudFormation/CDK/Terraform) replaces unrepeatable console clicks.',
        'CloudFormation = declarative stacks; CDK = real code that synthesizes them.',
        'A pipeline (build -> test -> deploy) with rollout strategy makes deploys boring.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-serverless-patterns',
    title: 'Serverless Architecture Patterns',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 13,
    prompt: 'Assemble a serverless backend from AWS building blocks, and name the gotchas that bite serverless designs at scale.',
    explanation: `Serverless composes managed, scale-to-zero building blocks so you run no servers and pay per use. The core kit: **API Gateway + Lambda + DynamoDB** for APIs, **S3 events + Lambda** for processing, **SQS/SNS/EventBridge** for decoupling, and **Step Functions** for orchestrating multi-step workflows.

**The canonical API.** API Gateway receives the request, a Lambda runs the logic, DynamoDB stores the data, and the whole thing scales from zero to thousands with no capacity planning. Add Cognito for auth, CloudFront for caching, and you have a production API with no servers.

**Event-driven processing.** An upload to S3 fires an event that triggers a Lambda (often via SQS for buffering and retries); the Lambda processes and writes results. EventBridge routes domain events to the right handlers. This is glue at its best: small functions reacting to events.

**Orchestration with Step Functions.** When a workflow has multiple steps with branching, retries, and waits (order -> charge -> reserve inventory -> notify), Step Functions models it as a state machine so you do not hand-roll the coordination in one giant Lambda.

**The gotchas.** Cold starts add first-call latency. Lambda concurrency limits and downstream connection storms (each invocation opening a DB connection) bite at scale, so use connection pooling/RDS Proxy or DynamoDB. Per-millisecond pricing makes always-on high throughput expensive. And distributed, event-driven flows are harder to trace, so X-Ray and idempotency are not optional.`,
    production:
      'Serverless shines for spiky, event-driven, and unpredictable workloads where paying nothing at idle wins. The failure mode is using it for steady high throughput (expensive) or ignoring the operational realities (cold starts, concurrency limits, connection storms, harder tracing). Design for those from the start.',
    walkthrough: [
      'Assemble API Gateway + Lambda + DynamoDB.',
      'Wire S3 events + SQS + Lambda for processing.',
      'Orchestrate multi-step flows with Step Functions.',
      'Mitigate cold starts, concurrency, and connection storms.',
    ],
    questions: [
      'What is the canonical serverless API stack?',
      'Why can Lambda cause database connection storms?',
      'When is serverless the wrong fit?',
    ],
    checklist: [
      'Design a serverless API end to end.',
      'Design event-driven processing with buffering.',
      'Name and mitigate three serverless gotchas.',
    ],
    interactive: {
      coldOpen:
        'A serverless API works beautifully in the demo, then a traffic spike sends Lambda concurrency through the roof, each invocation opens its own database connection, and the database hits its connection limit and starts refusing everyone. The architecture scaled; the database did not. Serverless removes server management but hands you a new set of scale gotchas, and knowing them up front is the whole game.',
      mental:
        'Compose scale-to-zero blocks: API Gateway + Lambda + DynamoDB for APIs, S3/SQS/EventBridge + Lambda for events, Step Functions for workflows. Mind cold starts, concurrency, connection storms, and cost at steady load.',
      diagram: {
        nodes: ['API Gateway', 'Lambda (logic)', 'DynamoDB (data)', 'S3 event -> SQS -> Lambda', 'Step Functions (orchestration)'],
        explanations: [
          'Managed front door: auth, throttling, routing, scales automatically.',
          'Stateless functions run the logic and scale per request.',
          'Key-access data store that scales with the functions (no connection limit).',
          'Uploads trigger buffered, retryable async processing.',
          'Coordinates multi-step workflows with branching and retries.',
        ],
      },
      example: {
        code: '# Serverless API\nGET /items -> API Gateway -> Lambda -> DynamoDB -> response   (scales 0..N)\n\n# Event-driven processing (buffered)\nS3 upload -> S3 event -> SQS -> Lambda -> resize -> write DynamoDB -> SNS notify\n\n# Multi-step workflow\nStep Functions: chargeCard -> reserveInventory -> sendEmail\n  (retries + branching per step, not one mega-Lambda)\n\n# Gotchas to design for\ncold start | concurrency limit | DB connection storm | per-ms cost at scale',
        output:
          'API GW + Lambda + DynamoDB -> no servers, scales to zero\nS3 -> SQS -> Lambda -> buffered, retryable processing\nStep Functions -> coordinated workflow with retries\nDynamoDB over RDS here -> avoids per-invocation connection limits',
        explain:
          'DynamoDB pairs naturally with Lambda because it has no connection limit to exhaust. Buffering S3 events through SQS adds retries and smooths spikes. Step Functions handles multi-step coordination so no single Lambda becomes a tangle.',
      },
      build: {
        simple: 'API Gateway + Lambda + DynamoDB for APIs; S3/SQS/EventBridge + Lambda for events.',
        actually:
          'Provisioned concurrency removes cold starts for latency-sensitive Lambdas at a cost. For relational databases behind Lambda, RDS Proxy pools connections so a concurrency spike does not exhaust the database; DynamoDB sidesteps the problem entirely. EventBridge gives content-based routing and decoupling between producers and many consumers. Step Functions express vs standard workflows trade cost for duration limits. Idempotency keys are essential because retries and at-least-once delivery mean handlers run more than once.',
        breaks:
          'Steady high throughput on Lambda costs far more than containers. Cold starts hurt p99 on spiky latency-sensitive paths. A Lambda fronting RDS without pooling causes connection storms. Long or heavy jobs hit the Lambda timeout and belong on containers/batch. Tracing a failure across API Gateway -> Lambda -> SQS -> Lambda is hard without X-Ray and correlation ids. Tight coupling of Lambdas via synchronous invoke recreates the cascade serverless was meant to avoid.',
      },
      doThisNow: [
        {
          task: 'Design a serverless API for a notes app (create, list, get notes) and justify each block, including why DynamoDB over RDS here.',
          reveal:
            'API Gateway (front door, auth via Cognito, throttling) -> Lambda (create/list/get logic) -> DynamoDB (notes keyed by userId + noteId). DynamoDB over RDS because Lambda scales per request and DynamoDB has no connection limit to exhaust, where RDS would need RDS Proxy to survive a concurrency spike. CloudFront caches GETs. The whole thing scales from zero and costs nothing at idle.',
        },
        {
          task: 'A latency-sensitive serverless endpoint has cold-start spikes and its RDS database hits connection limits under load. Prescribe two fixes.',
          reveal:
            'For cold starts: provisioned concurrency (keep warm instances) and a lighter init/package. For the connection limit: put RDS Proxy in front to pool and reuse connections across invocations (or move that data to DynamoDB if access patterns allow). Together they fix the two classic serverless-at-scale failures.',
        },
      ],
      warStory:
        'A team migrated a steady, always-busy API to Lambda + RDS for "simplicity". Under normal load Lambda concurrency opened thousands of database connections and RDS started rejecting them, taking the API down. RDS Proxy (connection pooling) stabilized it, and they later moved the hottest path to DynamoDB. Serverless plus a relational database needs a connection strategy, or scale becomes the outage.',
      tweak: {
        instruction: 'Your event-driven Lambda occasionally processes the same S3 upload twice, double-charging a customer. What design element is missing?',
        reveal:
          'Idempotency. Events can be delivered more than once (at-least-once), so the handler must use an idempotency key (the object key or a job id) to detect and skip a duplicate, making reprocessing a no-op instead of a second charge.',
      },
      receipt: {
        explain: [
          'Serverless composes scale-to-zero blocks: API Gateway + Lambda + DynamoDB, S3/SQS/EventBridge events, Step Functions workflows.',
          'Design for cold starts, concurrency limits, connection storms, and per-ms cost.',
        ],
        question: 'Serverless is one architecture. When containers fit better, how do you assemble a resilient container architecture?',
      },
      recap: [
        'API Gateway + Lambda + DynamoDB is the canonical serverless API.',
        'Buffer events through SQS; orchestrate multi-step flows with Step Functions.',
        'Mitigate cold starts (provisioned concurrency) and connection storms (RDS Proxy/DynamoDB); make handlers idempotent.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-container-patterns',
    title: 'Container Architecture Patterns',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 13,
    prompt: 'Assemble a production container architecture on ECS/Fargate and name what makes it resilient and scalable.',
    explanation: `Containers give you portable, consistent deploys with more control than serverless and less ops than raw EC2. A production container architecture on AWS composes: **ECR** (image registry), **ECS/Fargate** (run the containers), an **ALB** (route traffic), **Auto Scaling** (match capacity to load), spread across **multiple AZs**, fronted by **CloudFront** and backed by **RDS/DynamoDB**.

**Build and run.** You build a Docker image, push it to **ECR**, and ECS runs it as **tasks** (a running container or group) managed by a **service** that keeps a desired count alive and replaces failures. **Fargate** runs those tasks with no servers to patch; ECS-on-EC2 gives more control and can be cheaper at steady scale.

**Resilience.** Run tasks across at least two AZs behind an ALB with health checks so a failed task or AZ is routed around. The service auto-replaces unhealthy tasks; deployments roll out gradually (rolling or blue/green) so a bad image does not take everything down at once.

**Scaling.** Service auto scaling adjusts the task count on a metric (CPU, request count, or queue depth for workers). For worker fleets, scale on SQS queue depth so backlog drives capacity. Right-size task CPU/memory to avoid paying for idle.

**The tradeoffs.** Containers avoid Lambda cold starts and per-ms cost at steady load, but you manage images, task sizing, and scaling policies. They are the middle ground: more portable and controllable than serverless, far less to operate than EC2 fleets.`,
    production:
      'A standard production setup: ECR + Fargate service across multiple AZs behind an ALB, auto-scaling on CPU/request count, CloudFront in front, RDS multi-AZ behind. It avoids serverless cold-start and cost surprises for steady traffic while keeping deploys portable and ops light.',
    walkthrough: [
      'Build, push to ECR, run as ECS/Fargate tasks.',
      'Front with an ALB across multiple AZs with health checks.',
      'Auto-scale on the right metric (CPU/requests/queue depth).',
      'Roll out safely and right-size tasks.',
    ],
    questions: [
      'What does an ECS service do that a bare task does not?',
      'What metric should a worker fleet scale on?',
      'When do containers beat serverless?',
    ],
    checklist: [
      'Assemble ECR + Fargate + ALB across AZs.',
      'Choose an auto-scaling metric.',
      'Design a safe rollout.',
    ],
    interactive: {
      coldOpen:
        'A containerized API runs as a single task in one AZ. The task crashes at midnight, nothing replaces it, and the service is down until someone wakes up. The fix is structural: an ECS service keeping multiple tasks alive across AZs behind an ALB, so a dead task is replaced in seconds and an AZ failure is routed around. Container resilience is something you design in, not hope for.',
      mental:
        'Build -> ECR -> ECS/Fargate tasks managed by a service that keeps N alive across AZs behind an ALB, auto-scaling on the right metric, deployed gradually.',
      diagram: {
        nodes: ['ECR (image)', 'ALB (across AZs)', 'ECS/Fargate service (N tasks, multi-AZ)', 'Auto scaling (CPU/req/queue)', 'RDS multi-AZ / DynamoDB'],
        explanations: [
          'The registry holding your built Docker image.',
          'Layer-7 load balancer with health checks, spanning AZs.',
          'Keeps the desired task count alive across AZs; replaces failures.',
          'Adjusts task count on a metric so capacity matches load.',
          'The data tier, itself multi-AZ for failover.',
        ],
      },
      example: {
        code: '# Build and run\ndocker build -> push to ECR -> ECS service (desired=3, across AZ a/b/c)\nALB health check /healthz -> drains unhealthy tasks, routes around AZ loss\n\n# Scale on the RIGHT signal\nweb service  -> target tracking on CPU or ALB request count per task\nworker fleet -> scale on SQS ApproximateNumberOfMessages (backlog)\n\n# Deploy safely\nrolling or blue/green -> shift gradually -> auto-rollback on alarm',
        output:
          'service keeps N tasks alive -> a crash is replaced automatically\nmulti-AZ + ALB -> survive a task or AZ failure\nscale on queue depth -> workers match backlog, not guesswork\nblue/green -> a bad image does not take everything at once',
        explain:
          'The ECS service maintains the desired count across AZs and the ALB routes around failures. Web tiers scale on CPU or request count; worker tiers scale on queue depth so backlog drives capacity.',
      },
      build: {
        simple: 'ECR + ECS/Fargate service across AZs behind an ALB, auto-scaled and rolled out gradually.',
        actually:
          'A task definition pins image, CPU/memory, and environment; the service enforces desired count, health, and placement across AZs. Fargate removes node management; ECS-on-EC2 lets you pack tasks densely and use spot for cost. Target-tracking scaling holds a metric (50% CPU) by adding/removing tasks; step scaling reacts to thresholds. Blue/green via CodeDeploy shifts traffic to a new task set and rolls back on alarms. Secrets come from Secrets Manager/Parameter Store, not the image.',
        breaks:
          'A single task or single-AZ service has no resilience; one failure is an outage. Scaling a worker fleet on CPU instead of queue depth leaves backlog growing while CPU looks fine. Oversized task CPU/memory wastes money; undersized causes throttling and OOM kills. A missing or wrong health check makes the ALB drain healthy tasks or keep dead ones. Baking secrets or config into the image leaks them and forces a rebuild for every change.',
      },
      doThisNow: [
        {
          task: 'Design a resilient container deployment for a web API: how many tasks, across how many AZs, behind what, scaling on what, and how do you deploy a new version safely?',
          reveal:
            'At least 2-3 Fargate tasks spread across 2-3 AZs in an ECS service behind an ALB with a /healthz check. Auto-scale with target tracking on CPU or ALB request-count-per-target. Deploy via blue/green (or rolling): bring up the new task set, shift traffic gradually, watch alarms, auto-rollback on failure. A task or AZ loss is handled automatically; a bad deploy is caught before full exposure.',
        },
        {
          task: 'A worker service that drains an SQS queue is scaled on CPU and the backlog keeps growing during spikes even though CPU is moderate. Fix the scaling.',
          reveal:
            'Scale on the queue itself (SQS ApproximateNumberOfMessages or messages-per-task), not CPU. Workers can be backlogged while individually CPU-light, so CPU is the wrong signal; queue depth directly reflects pending work and drives the right number of tasks to drain it.',
        },
      ],
      warStory:
        'A team ran their API as one Fargate task to save money. It crashed during a deploy and there was no second task to serve traffic, so the site was down for the length of a cold restart. Running a multi-task, multi-AZ service (a few cents more) meant the next crash was invisible: the service replaced the task while others kept serving. Redundancy is cheaper than the outage it prevents.',
      tweak: {
        instruction: 'When do you pick containers over serverless for a service?',
        reveal:
          'When traffic is steady/high (per-ms Lambda pricing loses to always-on tasks), when you need long-running or heavy processes that exceed Lambda limits, when cold starts are unacceptable, or when you want one portable Docker artifact across environments. Serverless still wins for spiky, event-driven, scale-to-zero workloads.',
      },
      receipt: {
        explain: [
          'ECR + ECS/Fargate service across AZs behind an ALB, auto-scaled and rolled out gradually.',
          'Scale web tiers on CPU/requests, worker tiers on queue depth; keep secrets out of the image.',
        ],
        question: 'Serverless and containers each have a cost shape. How do you actually estimate and control AWS cost, scaling, and reliability?',
      },
      recap: [
        'An ECS service keeps N tasks alive across AZs behind an ALB; failures self-heal.',
        'Scale web on CPU/requests, workers on queue depth; deploy blue/green.',
        'Containers beat serverless for steady/high load and long jobs; keep config/secrets external.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-cost-scaling',
    title: 'Cost, Scaling, and Reliability Patterns',
    type: 'lesson',
    difficulty: 'Hard',
    minutes: 13,
    prompt: 'Estimate the cost tradeoff between serverless, containers, and EC2 for a workload, and name the levers that control cost, scaling, and reliability.',
    explanation: `Three concerns intertwine on AWS: **cost** (what you pay), **scaling** (matching capacity to load), and **reliability** (surviving failures). Good architecture balances them deliberately rather than discovering the bill or the outage later.

**The cost shape by compute.** Lambda costs near zero at idle and scales per request, so it wins for spiky/low/unpredictable load but gets expensive at high steady throughput. Containers/EC2 cost for provisioned capacity (you pay for idle) but are far cheaper at high steady load. The crossover (utilization where always-on beats per-request) is the core estimate. Reserved Instances and Savings Plans cut steady EC2/Fargate cost by committing; Spot cuts it further for fault-tolerant work.

**The big cost surprises.** Data transfer (cross-AZ, cross-region, NAT gateway processing, and egress to the internet) is a frequent silent line item. Idle provisioned resources (oversized instances, unused EBS, forgotten environments) leak money. S3 request and retrieval costs and over-provisioned DynamoDB capacity add up. Tag resources and watch Cost Explorer.

**Scaling levers.** Auto Scaling (instances/tasks on a metric), DynamoDB on-demand vs provisioned, caching (CloudFront, ElastiCache) to cut load and cost, and asynchronous queues to absorb spikes. Scale on the metric that reflects real work (request count, queue depth), not a proxy.

**Reliability levers.** Multi-AZ everywhere (cheap), multi-region only when needed (expensive), health checks + auto-replacement, retries with backoff and DLQs, and graceful degradation (serve cached/partial results when a dependency is down). Reliability is mostly redundancy and handling failure as normal.`,
    production:
      'The mature move is to right-size and commit (Savings Plans/Reserved for steady baseline, Spot for batch, on-demand for spikes), cache aggressively to cut both load and cost, keep everything multi-AZ, and watch data-transfer and idle-resource costs that do not show up in the obvious places. Cost, scaling, and reliability are dials you set on purpose.',
    walkthrough: [
      'Estimate the serverless-vs-container-vs-EC2 cost curve.',
      'Find the hidden costs (data transfer, idle, NAT).',
      'Pick the right scaling metric and caching.',
      'Apply reliability levers (multi-AZ, retries, degradation).',
    ],
    questions: [
      'Where is the cost crossover between Lambda and containers?',
      'What are common hidden AWS costs?',
      'What does graceful degradation mean?',
    ],
    checklist: [
      'Reason about a compute cost curve.',
      'Identify hidden cost line items.',
      'List reliability levers for a service.',
    ],
    interactive: {
      coldOpen:
        'Two teams run the same traffic. One gets a five-figure surprise bill driven by NAT gateway data processing and a fleet of oversized, half-idle instances; the other pays a fraction by caching at the edge, committing to a baseline with Savings Plans, and using a VPC endpoint to skip NAT. Same workload, very different bill, decided by a handful of cost levers most people never look at until the invoice arrives.',
      mental:
        'Cost, scaling, and reliability are dials. Lambda wins spiky/low, containers/EC2 win steady/high; cache to cut load and cost; multi-AZ for cheap reliability; watch data transfer and idle resources.',
      diagram: {
        nodes: ['Workload shape', 'Compute choice + commit (Spot/Savings)', 'Cache (CloudFront/ElastiCache)', 'Scale on real metric', 'Multi-AZ + retries + degradation'],
        explanations: [
          'Spiky vs steady, light vs heavy: this drives every other choice.',
          'Lambda for spiky, containers/EC2 for steady; commit for baseline, Spot for batch.',
          'Caching cuts both load and cost on read-heavy paths.',
          'Auto-scale on request count or queue depth, not a proxy metric.',
          'Redundancy and handling failure as normal keep it up.',
        ],
      },
      example: {
        code: '# Compute cost curve (illustrative)\nlow / spiky volume    -> Lambda      (near-zero idle cost)\nhigh steady volume    -> containers/EC2 + Savings Plan (no per-ms premium)\nfault-tolerant batch  -> EC2/Fargate Spot (deep discount)\n\n# Hidden costs to watch\ncross-AZ + cross-region transfer | NAT gateway per-GB | internet egress\nidle/oversized instances | unused EBS | over-provisioned DynamoDB\n\n# Reliability levers\nmulti-AZ (cheap) | retries+backoff+DLQ | cache fallback / degrade gracefully',
        output:
          'spiky -> Lambda; steady -> containers/EC2 + commit; batch -> Spot\nbiggest silent costs -> data transfer + idle resources\ncaching -> cuts load AND cost on reads\nmulti-AZ + degradation -> survive failures cheaply',
        explain:
          'Match compute to the traffic curve and commit for the steady baseline. The bill surprises live in data transfer and idle capacity. Caching and multi-AZ buy both performance and resilience.',
      },
      build: {
        simple: 'Lambda for spiky, containers/EC2 for steady; cache, commit, multi-AZ, watch transfer and idle.',
        actually:
          'Savings Plans/Reserved trade a 1-3 year commit for ~30-70% off steady compute; Spot offers up to ~90% off but can be reclaimed, so it suits fault-tolerant batch and stateless workers. VPC gateway endpoints for S3/DynamoDB remove NAT data-processing charges. DynamoDB on-demand avoids capacity planning but costs more per request than well-tuned provisioned with auto scaling. Graceful degradation (serve stale cache, drop non-critical features) keeps the core up when a dependency fails; load shedding sheds excess rather than collapsing.',
        breaks:
          'Defaulting to one compute model regardless of shape over-pays (Lambda at steady scale) or under-utilizes (idle EC2). Routing all egress through NAT (especially cross-AZ) racks up data charges that dwarf compute. No tags means you cannot attribute or cut cost. Scaling on a proxy metric leaves real work backed up. Single-AZ to save money is a false economy that an AZ blip turns into an outage. Retries without backoff/jitter cause retry storms that worsen an outage.',
      },
      doThisNow: [
        {
          task: 'Estimate compute for a service that is busy 9-5 on weekdays and idle otherwise. Serverless, containers, or a mix, and why?',
          reveal:
            'A mix often wins: containers/EC2 (with auto scaling and a Savings Plan for the baseline) during business hours when steady load makes per-request pricing lose, scaling down to a minimal footprint off-hours. If off-hours traffic is truly near zero and bursty, Lambda for those paths avoids paying for idle. The point is to match the curve, not pick one model for all 168 hours.',
        },
        {
          task: 'A team has a surprising bill. List three places to look first that are not the compute line.',
          reveal:
            'Data transfer (cross-AZ/region, internet egress, NAT gateway per-GB processing), idle/oversized resources (forgotten instances, unattached EBS volumes, non-prod environments left running), and storage/request costs (S3 requests and retrieval, over-provisioned DynamoDB capacity). These silent line items often exceed the obvious compute cost.',
        },
      ],
      warStory:
        'A company routed all private-subnet traffic, including heavy S3 reads, through a single NAT gateway. The NAT per-GB processing charge alone became one of their largest line items. Adding a free S3 gateway VPC endpoint moved that traffic off NAT and cut the bill sharply. The expensive part was not compute or storage; it was how the bytes traveled.',
      tweak: {
        instruction: 'A dependency (a recommendations service) goes down and takes the whole product page with it. What reliability pattern was missing?',
        reveal:
          'Graceful degradation. The page should treat recommendations as non-critical: on failure, serve the page without them (or with cached/fallback content) instead of failing entirely. Isolate non-essential dependencies so their failure degrades, rather than collapses, the core experience.',
      },
      receipt: {
        explain: [
          'Match compute to the traffic curve; commit for baseline, Spot for batch, cache to cut load and cost.',
          'Watch data transfer and idle resources; multi-AZ, retries+backoff+DLQ, and degradation for reliability.',
        ],
        question: 'You can reason about all the pieces. Can you put them together under interview pressure into a full system design?',
      },
      recap: [
        'Lambda wins spiky/low; containers/EC2 win steady/high; find the crossover.',
        'Hidden costs hide in data transfer and idle resources; cache and commit.',
        'Reliability = multi-AZ, health checks + auto-replace, retries with backoff/DLQ, graceful degradation.',
      ],
    },
  },

  {
    id: 'aws-rung-deep-interview',
    title: 'AWS System-Design Scenarios',
    type: 'lesson',
    difficulty: 'Boss',
    minutes: 15,
    prompt: 'Design three classic AWS systems out loud: a static site with API, an async upload pipeline, and a scalable read-heavy service. Name the services and the tradeoffs.',
    explanation: `System-design interviews and real architecture come down to composing the building blocks you now know into a coherent system, and defending the tradeoffs. Here are three canonical scenarios with a reference answer each.

**1. Host a frontend with an API.** Static React build in **S3**, served globally through **CloudFront** (edge cache, TLS). The API is **API Gateway + Lambda + DynamoDB** (serverless) or an **ALB + ECS/Fargate** (containers) behind CloudFront. **Route 53** maps the domain. Tradeoff: serverless for spiky/low traffic and zero ops; containers for steady/high traffic to avoid per-ms cost and cold starts.

**2. Process uploads asynchronously.** User uploads to **S3** (presigned URL, direct, off your servers). The S3 event triggers **SQS** (buffer + retries), a **Lambda or Fargate worker** processes (resize, scan, transcode), writes results to **S3/DynamoDB**, and notifies via **SNS**. Tradeoff: async means the user is not blocked and spikes are absorbed; you must design idempotency, a DLQ, and visibility timeout > processing time.

**3. Scalable read-heavy API.** **CloudFront** caches at the edge; **ElastiCache** (cache-aside) absorbs hot reads; **RDS/Aurora** with **read replicas** scales reads, multi-AZ for failover; **Auto Scaling** on the compute tier. Tradeoff: caching adds staleness you must bound (TTL + invalidation), replicas can lag (read-your-writes from primary), and the cache becomes a dependency to protect (thundering herd on a flush).

**The method.** Clarify requirements and scale, pick building blocks, walk the request path, then volunteer the tradeoffs and failure modes before being asked. Naming the failure modes is what separates a senior answer.`,
    production:
      'These three patterns (static+API, async pipeline, read-heavy with caching) cover a large share of real backend systems and interview prompts. The senior move is not naming services; it is stating the tradeoffs, the failure modes, and the cost/scaling implications without being prompted.',
    walkthrough: [
      'Design a static site + API and justify serverless vs containers.',
      'Design an async upload pipeline with idempotency and a DLQ.',
      'Design a read-heavy API with caching and replicas.',
      'Volunteer tradeoffs and failure modes for each.',
    ],
    questions: [
      'How do you host a React app and its API on AWS?',
      'How do you process uploads without blocking the user?',
      'How do you scale a read-heavy API?',
    ],
    checklist: [
      'Design three canonical AWS systems.',
      'Name services and request paths.',
      'Volunteer tradeoffs and failure modes.',
    ],
    interactive: {
      coldOpen:
        'The interviewer says "design an image-sharing backend on AWS" and the clock starts. A weak answer lists services. A strong answer walks the request path (upload to S3 via presigned URL, event to SQS, worker resizes, CloudFront serves), then volunteers the failure modes (duplicate processing, poison messages, cache staleness) before being asked. You already know every block; this lesson is about composing and defending them.',
      mental:
        'Clarify scale, pick blocks, walk the request path, then volunteer tradeoffs and failure modes. The three canonical systems: static+API, async pipeline, read-heavy with caching.',
      diagram: {
        nodes: ['Clarify requirements + scale', 'Pick building blocks', 'Walk the request path', 'Volunteer tradeoffs + failure modes', 'Cost + scaling notes'],
        explanations: [
          'Ask about traffic, consistency, latency, budget before designing.',
          'Choose S3/CloudFront/Lambda/ECS/RDS/DynamoDB/SQS to fit.',
          'Trace a request end to end so the design is concrete.',
          'Name staleness, duplicates, lag, cold starts before being asked.',
          'Close with the cost shape and how it scales.',
        ],
      },
      example: {
        code: '# 1. Static frontend + API\nRoute 53 -> CloudFront -> S3 (React build)\n                     \\-> API Gateway -> Lambda -> DynamoDB   (or ALB -> Fargate)\n\n# 2. Async upload pipeline\nclient -> presigned PUT -> S3 -> event -> SQS -> worker -> S3/DynamoDB -> SNS notify\n  (idempotency key, DLQ, visibility timeout > processing time)\n\n# 3. Read-heavy API\nCloudFront (edge) -> ALB -> app (Auto Scaling) -> ElastiCache (cache-aside)\n                                              \\-> Aurora + read replicas (multi-AZ)',
        output:
          'static+API   -> S3/CloudFront + Lambda/DynamoDB or Fargate\nasync upload -> S3 event + SQS + worker + DLQ + idempotency\nread-heavy   -> CloudFront + ElastiCache + read replicas\nsenior tell  -> you name the failure modes unprompted',
        explain:
          'Each scenario is a composition of known blocks with an explicit request path. The differentiator is volunteering the tradeoffs (cache staleness, duplicate processing, replica lag) as part of the answer.',
      },
      build: {
        simple: 'Compose known blocks, walk the request path, and volunteer the tradeoffs.',
        actually:
          'Clarifying questions set the scale (reads/writes per second, consistency needs, latency budget, growth) which decides serverless vs containers, SQL vs NoSQL, and how much caching. Each design has a signature failure mode: the async pipeline needs idempotency + DLQ + correct visibility timeout; the read-heavy design needs bounded staleness + read-your-writes + thundering-herd protection; the static+API needs correct cache-control and not caching per-user responses. Mentioning multi-AZ, retries with backoff, and graceful degradation shows reliability thinking.',
        breaks:
          'Jumping to services without clarifying scale designs the wrong system. Listing services without a request path or tradeoffs reads as memorization. Forgetting idempotency in an at-least-once pipeline, caching authenticated responses, or ignoring replica lag are the mistakes interviewers probe. Designing for infinite scale a small system does not need is over-engineering; not asking about scale at all is under-engineering.',
      },
      doThisNow: [
        {
          task: 'Design an image-sharing backend end to end: upload, processing, storage, and serving, with the failure modes you would volunteer.',
          reveal:
            'Upload: client gets a presigned URL and PUTs directly to S3 (off your servers). Processing: S3 event -> SQS -> worker (resize/scan) -> writes thumbnails to S3 and metadata to DynamoDB -> SNS notifies the user. Serving: CloudFront serves public images from the edge; private ones via presigned URLs. Failure modes to volunteer: at-least-once delivery means duplicate processing (idempotency key on the object), poison messages (DLQ), visibility timeout > processing time, and cache invalidation when an image changes. Multi-AZ throughout.',
        },
        {
          task: 'Design a read-heavy product catalog API (100k reads/s, few writes). Name the caching and database choices and the two staleness pitfalls.',
          reveal:
            'CloudFront caches GETs at the edge (most traffic never reaches origin); ElastiCache (cache-aside) absorbs remaining hot reads; Aurora with read replicas handles the rest, multi-AZ for failover; compute auto-scales. Pitfalls: bounded staleness (set TTLs and invalidate cache on writes so prices are not stale) and replica lag (read a user own just-written change from the primary). Protect against a cache-flush thundering herd with single-flight repopulation and staggered TTLs.',
        },
      ],
      warStory:
        'In an interview a candidate designed an upload pipeline with S3, SQS, and a worker, then, unprompted, said "standard SQS is at-least-once, so I will key processing on the object id for idempotency and add a DLQ for poison messages, with the visibility timeout above worst-case processing time". The interviewer stopped taking notes and said "you have clearly run one of these in production". Volunteering the failure modes is the senior signal.',
      tweak: {
        instruction: 'You have 30 seconds left and have only listed services. What one sentence most raises the quality of your answer?',
        reveal:
          'Name the signature failure mode and its mitigation: for example, "because SQS is at-least-once, the worker must be idempotent on the object key, with a DLQ for poison messages." One concrete tradeoff sentence shows real-world judgment that a service list never does.',
      },
      receipt: {
        explain: [
          'Clarify scale, pick blocks, walk the request path, then volunteer tradeoffs and failure modes.',
          'Three canonical systems: static+API, async upload pipeline, read-heavy with caching.',
        ],
        question: 'You can now design AWS systems end to end. Which of these patterns will you build for real next?',
      },
      recap: [
        'Compose known blocks; walk a concrete request path; defend the tradeoffs.',
        'Static+API (S3/CloudFront + Lambda/Fargate), async pipeline (S3+SQS+worker+DLQ), read-heavy (CloudFront+ElastiCache+replicas).',
        'Volunteering failure modes (duplicates, staleness, lag, cold starts) is the senior signal.',
      ],
    },
  },
]

// AWS capstone design problems. type:'design' so they sort after the lessons
// and flashcards (see getProblemPhaseRank). Each asks the learner to produce a
// full architecture and defend the tradeoffs, applying the deep dives above.

function awsDesign(
  id: string,
  title: string,
  difficulty: Problem['difficulty'],
  minutes: number,
  prompt: string,
  checklist: string[],
): Problem {
  return { id, title, type: 'design', difficulty, minutes, prompt, checklist }
}

export const awsDesignCapstones: Problem[] = [
  awsDesign(
    'design-aws-image-service',
    'Design: Image-Sharing Backend on AWS',
    'Hard',
    45,
    'Design the backend for an image-sharing app on AWS: users upload photos, the system generates thumbnails and tags them, and others view them. Cover upload, async processing, storage, serving (public and private), and the failure modes you would volunteer unprompted.',
    [
      'Upload directly to S3 via a presigned URL, keeping bytes off your servers.',
      'Store the bytes in S3 and only the key + metadata in the database.',
      'Process asynchronously: S3 event -> SQS -> worker (resize/tag) -> write results.',
      'Make the worker idempotent (key on object id) and add a DLQ for poison messages.',
      'Set the SQS visibility timeout above worst-case processing time.',
      'Serve public images via CloudFront; private images via short-lived presigned URLs.',
      'Run multi-AZ; notify the user on completion via SNS.',
      'Volunteer the failure modes: duplicate processing, poison messages, cache staleness.',
    ],
  ),
  awsDesign(
    'design-aws-serverless-api',
    'Design: Serverless API (Lambda + API Gateway + DynamoDB)',
    'Hard',
    40,
    'Design a serverless JSON API on AWS (create/list/get for a resource) that scales from zero and costs nothing at idle. Cover the request path, auth, the data store choice, and the serverless gotchas you would design around.',
    [
      'Request path: API Gateway -> Lambda -> DynamoDB, with Cognito for auth.',
      'Choose DynamoDB over RDS here so Lambda concurrency does not exhaust DB connections.',
      'Model DynamoDB keys around the access patterns (no ad hoc joins).',
      'Mitigate cold starts (provisioned concurrency) on latency-sensitive paths.',
      'If RDS is required, put RDS Proxy in front to pool connections.',
      'Cache GETs at the edge with CloudFront; throttle per-client at API Gateway.',
      'Make handlers idempotent (retries and at-least-once events run more than once).',
      'State when this becomes the wrong fit (steady high throughput -> containers).',
    ],
  ),
  awsDesign(
    'design-aws-read-heavy',
    'Design: Scalable Read-Heavy API',
    'Hard',
    40,
    'Design a read-heavy product-catalog API on AWS (100k reads/s, few writes). Cover caching, the database tier, how you scale reads, and the staleness pitfalls you would call out.',
    [
      'Cache GETs at the edge with CloudFront so most traffic never hits the origin.',
      'Add ElastiCache (cache-aside) to absorb remaining hot reads.',
      'Use RDS/Aurora with read replicas for read scale; multi-AZ for failover.',
      'Auto-scale the compute tier on request count, not a proxy metric.',
      'Bound staleness with TTLs and invalidate the cache on writes.',
      'Handle replica lag: read a user own just-written data from the primary.',
      'Protect against a cache-flush thundering herd (single-flight repopulation, staggered TTLs).',
      'Name the tradeoff: caching adds staleness you must manage deliberately.',
    ],
  ),
  awsDesign(
    'design-aws-resilient-jobs',
    'Design: Resilient Job Processing with Retries and DLQ',
    'Hard',
    40,
    'Design a resilient asynchronous job-processing system on AWS (for example, sending notifications or running billing). Cover decoupling, retries, poison-message handling, idempotency, scaling the workers, and observability.',
    [
      'Decouple producers from workers with SQS so a spike buffers instead of cascading.',
      'Make workers idempotent with an idempotency key (jobs run at least once).',
      'Set the visibility timeout above worst-case processing time to avoid duplicate work.',
      'Route messages that fail N times to a dead-letter queue, not an infinite loop.',
      'Scale the worker fleet on queue depth (SQS message count), not CPU.',
      'Use FIFO only if you truly need ordering/exactly-once (lower throughput).',
      'Alarm on DLQ depth and queue age; trace failures with X-Ray + correlation ids.',
      'Choose SNS/EventBridge if multiple consumers need the same event.',
    ],
  ),
]
