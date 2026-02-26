import type { SoftwareParameter, SoftwareInventivePrinciple, ContradictionEntry } from "./types";

// ═══════════════════════════════════════════════════════════════════
// 35 SOFTWARE ENGINEERING PARAMETERS
// ═══════════════════════════════════════════════════════════════════
export const SOFTWARE_PARAMETERS: SoftwareParameter[] = [
  { id: 1, name: "Response Latency", category: "performance", description: "Time from request to first response byte", exampleTradeoff: "Lower latency often requires more compute or caching infrastructure" },
  { id: 2, name: "Data Consistency", category: "data", description: "Guarantee that all nodes see the same data at the same time", exampleTradeoff: "Strong consistency reduces availability and increases latency (CAP theorem)" },
  { id: 3, name: "Throughput", category: "performance", description: "Number of operations or requests processed per unit time", exampleTradeoff: "Higher throughput may require batching, reducing individual request latency" },
  { id: 4, name: "Resource Cost", category: "operations", description: "Compute, memory, storage, and network costs", exampleTradeoff: "Reducing cost often means accepting higher latency or lower redundancy" },
  { id: 5, name: "Query Performance", category: "performance", description: "Speed and efficiency of database/search queries", exampleTradeoff: "Denormalization speeds reads but slows writes and increases storage" },
  { id: 6, name: "Data Freshness", category: "data", description: "How up-to-date the data is when served to users", exampleTradeoff: "Real-time data requires event-driven architecture, adding complexity" },
  { id: 7, name: "Horizontal Scalability", category: "scale", description: "Ability to add more nodes to handle increased load", exampleTradeoff: "Scaling out introduces distributed coordination complexity" },
  { id: 8, name: "Predictable Costs", category: "operations", description: "Ability to forecast and control infrastructure spending", exampleTradeoff: "Predictable costs may limit ability to handle traffic spikes" },
  { id: 9, name: "Fault Tolerance", category: "reliability", description: "System continues operating despite component failures", exampleTradeoff: "Redundancy increases cost and data synchronization complexity" },
  { id: 10, name: "Infrastructure Complexity", category: "operations", description: "Number of moving parts in the deployment architecture", exampleTradeoff: "Simpler infra may limit performance tuning and scaling options" },
  { id: 11, name: "Authentication Strength", category: "security", description: "Security level of identity verification", exampleTradeoff: "Stronger auth (MFA, biometrics) increases user friction" },
  { id: 12, name: "User Friction", category: "product", description: "Number of steps/barriers users face to complete actions", exampleTradeoff: "Reducing friction may weaken security or data quality" },
  { id: 13, name: "Feature Completeness", category: "product", description: "Breadth of functionality offered to users", exampleTradeoff: "More features increase maintenance burden and UX complexity" },
  { id: 14, name: "UX Simplicity", category: "product", description: "Ease of understanding and using the interface", exampleTradeoff: "Simplicity may limit power-user capabilities" },
  { id: 15, name: "Development Velocity", category: "engineering", description: "Speed at which new features can be shipped", exampleTradeoff: "Moving fast may accumulate technical debt" },
  { id: 16, name: "Code Quality / Maintainability", category: "engineering", description: "Readability, testability, and long-term health of the codebase", exampleTradeoff: "High quality code takes longer to write initially" },
  { id: 17, name: "Model Accuracy", category: "ai_ml", description: "Correctness of ML model predictions", exampleTradeoff: "Higher accuracy often requires more training data and compute" },
  { id: 18, name: "Inference Latency", category: "ai_ml", description: "Time to generate a prediction from an ML model", exampleTradeoff: "Faster inference may require model compression, reducing accuracy" },
  { id: 19, name: "Training Data Volume", category: "ai_ml", description: "Amount of data available for model training", exampleTradeoff: "More data improves models but raises privacy and storage concerns" },
  { id: 20, name: "Privacy Preservation", category: "security", description: "Degree to which user data is protected from exposure", exampleTradeoff: "Strong privacy limits personalization and analytics capabilities" },
  { id: 21, name: "API Surface Area", category: "integration", description: "Breadth and depth of public APIs exposed", exampleTradeoff: "Larger API surface increases versioning and compatibility burden" },
  { id: 22, name: "Maintenance Burden", category: "engineering", description: "Ongoing effort required to keep the system running", exampleTradeoff: "Lower maintenance may mean less customization capability" },
  { id: 23, name: "Offline Capability", category: "reliability", description: "System functionality without network connectivity", exampleTradeoff: "Offline support requires sync logic and conflict resolution" },
  { id: 24, name: "Sync Complexity", category: "data", description: "Difficulty of keeping data consistent across clients/nodes", exampleTradeoff: "Simpler sync may sacrifice real-time accuracy" },
  { id: 25, name: "Observability Depth", category: "operations", description: "Ability to understand internal system state from external outputs", exampleTradeoff: "Deep observability adds performance overhead and data storage costs" },
  { id: 26, name: "Performance Overhead", category: "performance", description: "Extra resource consumption from non-functional concerns", exampleTradeoff: "Reducing overhead may sacrifice security, logging, or monitoring" },
  { id: 27, name: "Multi-tenancy Isolation", category: "architecture", description: "Degree of separation between tenant data and compute", exampleTradeoff: "Strong isolation increases infrastructure cost per tenant" },
  { id: 28, name: "Customization Flexibility", category: "architecture", description: "Ability for users/tenants to customize behavior", exampleTradeoff: "More customization increases testing matrix and support complexity" },
  { id: 29, name: "Schema Rigidity", category: "data", description: "Strictness of data schema enforcement", exampleTradeoff: "Rigid schemas prevent data corruption but slow iteration" },
  { id: 30, name: "Deployment Frequency", category: "engineering", description: "How often new versions can be safely released", exampleTradeoff: "Frequent deploys require robust CI/CD and testing infrastructure" },
  // ── New parameters for XLSX coverage ─────────────────────────────
  { id: 31, name: "Memory Usage", category: "performance", description: "RAM consumption and heap allocation efficiency", exampleTradeoff: "Lower memory usage may require more disk I/O or recomputation" },
  { id: 32, name: "Storage Footprint", category: "data", description: "Disk/block storage consumption and efficiency", exampleTradeoff: "Reducing storage may require compression, adding CPU overhead" },
  { id: 33, name: "Security Posture", category: "security", description: "Overall security strength across authentication, authorization, and encryption", exampleTradeoff: "Stronger security adds latency, complexity, and user friction" },
  { id: 34, name: "Real-time Performance", category: "performance", description: "Ability to process and respond within strict time bounds", exampleTradeoff: "Real-time guarantees require dedicated resources and simpler processing" },
  { id: 35, name: "Service Availability", category: "reliability", description: "Percentage of time the service is operational and reachable", exampleTradeoff: "Higher availability requires redundancy, increasing cost and complexity" },
];

// ═══════════════════════════════════════════════════════════════════
// 40 SOFTWARE INVENTIVE PRINCIPLES
// Classical TRIZ principles reinterpreted for software engineering
// ═══════════════════════════════════════════════════════════════════
export const SOFTWARE_PRINCIPLES: SoftwareInventivePrinciple[] = [
  {
    id: 1, name: "Segmentation / Microservices",
    description: "Break a monolith into independently deployable units. Isolate concerns so each can evolve, scale, and fail independently.",
    softwareExamples: [
      "Decompose monolith into microservices with independent databases",
      "Split a large ML pipeline into feature engineering, training, and serving stages",
      "Partition a message queue by topic for independent scaling",
    ],
  },
  {
    id: 2, name: "Extraction / Separation",
    description: "Move a concern to its own layer, service, or module. Extract what is useful or what is harmful into a separate entity.",
    softwareExamples: [
      "Extract authentication into a dedicated identity service",
      "Separate read models from write models in event-sourced systems",
      "Move business rules into a rules engine outside the main codebase",
    ],
  },
  {
    id: 3, name: "Asymmetry / Read-Write Split",
    description: "Separate the read path from the write path (CQRS). Accept write-side delay for read-side speed. Reconcile asynchronously.",
    softwareExamples: [
      "CQRS pattern with separate read/write stores",
      "Write to primary database, read from materialized views or read replicas",
      "Event sourcing: append-only writes, project to queryable read models",
    ],
  },
  {
    id: 4, name: "Prior Action / Pre-computation",
    description: "Cache, pre-compute, or warm up results before the request arrives. Trade stale-but-fast reads for eventual consistency.",
    softwareExamples: [
      "Pre-compute aggregations during off-peak hours (materialized views)",
      "CDN edge caching with TTL-based invalidation",
      "Warm ML model caches before production traffic shift",
    ],
  },
  {
    id: 5, name: "Inversion / Edge Push",
    description: "Move processing closer to the data source or user. Invert the traditional centralized architecture.",
    softwareExamples: [
      "Edge computing for IoT data processing (filter before send)",
      "Client-side ML inference (TensorFlow.js, Core ML) instead of server round-trip",
      "Database stored procedures for complex queries instead of application-layer joins",
    ],
  },
  {
    id: 6, name: "Intermediary / Proxy",
    description: "Insert middleware, sidecar, or gateway between components. The intermediary adds value without changing the endpoints.",
    softwareExamples: [
      "API gateway for rate limiting, auth, and request transformation",
      "Service mesh sidecar (Envoy) for observability and traffic control",
      "Message broker between producers and consumers for decoupling",
    ],
  },
  {
    id: 7, name: "Self-Service / Self-Healing",
    description: "System detects and recovers from failure automatically without human intervention.",
    softwareExamples: [
      "Kubernetes auto-restart on liveness probe failure",
      "Circuit breaker pattern with automatic retry and fallback",
      "Self-healing data pipelines that detect corruption and replay from source",
    ],
  },
  {
    id: 8, name: "Dynamism / Adaptive Config",
    description: "Replace static configuration with runtime-adaptive behavior. The system adjusts itself based on observed conditions.",
    softwareExamples: [
      "Dynamic rate limiting based on real-time traffic patterns",
      "Auto-scaling based on queue depth or CPU utilization",
      "Adaptive batch sizes in ML training based on gradient noise",
    ],
  },
  {
    id: 9, name: "Partial Action / Graceful Degradation",
    description: "Serve partial or approximate results when full results are unavailable. Upgrade to full consistency in the background.",
    softwareExamples: [
      "Return cached search results when the search service is slow",
      "Show stale dashboard data with a 'last updated' timestamp during outages",
      "Progressive image loading (blur-up then full resolution)",
    ],
  },
  {
    id: 10, name: "Feedback Loop / Observability",
    description: "Close the loop: measure, alert, auto-adjust. Use output signals to improve input decisions.",
    softwareExamples: [
      "A/B test results feed back into feature flag decisions",
      "Error rate monitoring triggers automatic rollback",
      "User engagement metrics auto-tune recommendation algorithms",
    ],
  },
  {
    id: 11, name: "Discarding / Ephemeral Resources",
    description: "Use disposable, short-lived resources instead of persistent ones. Rebuild rather than maintain.",
    softwareExamples: [
      "Spot instances for batch processing (accept interruption for cost savings)",
      "Ephemeral containers: rebuild on every deploy instead of patching",
      "Serverless functions: no servers to maintain, pay per invocation",
    ],
  },
  {
    id: 12, name: "Equipotentiality / Level Playing Field",
    description: "Eliminate unnecessary differences between components. Standardize interfaces so any node can handle any request.",
    softwareExamples: [
      "Stateless services behind a load balancer — any instance handles any request",
      "Homogeneous container images across environments (dev/staging/prod)",
      "Consistent hashing so any node can serve any key range",
    ],
  },
  {
    id: 13, name: "Universality / Abstraction",
    description: "One mechanism handles multiple use cases. Create a general-purpose tool instead of specialized solutions.",
    softwareExamples: [
      "GraphQL as a universal query interface over multiple REST APIs",
      "Plugin architecture that handles multiple data formats with one pipeline",
      "Generic workflow engine instead of hard-coded business process logic",
    ],
  },
  {
    id: 14, name: "Copying / Replication",
    description: "Replicate data or compute across nodes for availability, speed, or fault tolerance.",
    softwareExamples: [
      "Multi-region database replication for disaster recovery",
      "Read replicas to distribute query load",
      "Model ensembles: multiple models vote on the same prediction",
    ],
  },
  {
    id: 15, name: "Nesting / Composition",
    description: "Compose smaller primitives into complex behavior. Build systems from composable, reusable building blocks.",
    softwareExamples: [
      "Middleware chains in Express/Koa for cross-cutting concerns",
      "Terraform modules composing infrastructure from reusable blocks",
      "React component composition for complex UI from simple atoms",
    ],
  },
  {
    id: 16, name: "Slightly Less / Partial Action",
    description: "If you can't achieve the full effect, achieve slightly less — return partial results, paginate, or lazy-load.",
    softwareExamples: [
      "Paginated API responses instead of returning all records at once",
      "Lazy loading modules and images to reduce initial page load",
      "Approximate query answers (HyperLogLog for cardinality) when exact counts are too expensive",
    ],
  },
  {
    id: 17, name: "Dimensionality Change",
    description: "Move from one communication paradigm to another — request-response to streaming, 2D to 3D processing, sync to async.",
    softwareExamples: [
      "Replace polling with WebSocket or Server-Sent Events for real-time updates",
      "Event-driven architecture with Kafka instead of synchronous REST calls",
      "Stream processing (Flink/Spark Streaming) instead of batch ETL",
    ],
  },
  {
    id: 18, name: "Mechanical Vibration / Oscillation",
    description: "Use periodic signals — health checks, heartbeats, polling intervals — to detect problems and maintain system awareness.",
    softwareExamples: [
      "Heartbeat monitoring between distributed nodes",
      "Periodic liveness and readiness probes in Kubernetes",
      "Watchdog timers that reset stuck processes",
    ],
  },
  {
    id: 19, name: "Periodic Action",
    description: "Replace continuous operations with periodic ones — cron jobs, scheduled batch processing, periodic garbage collection.",
    softwareExamples: [
      "Scheduled ETL batch jobs during off-peak hours",
      "Periodic cache invalidation sweeps instead of per-write invalidation",
      "Scheduled database vacuum/analyze operations",
    ],
  },
  {
    id: 20, name: "Continuity of Useful Action",
    description: "Keep useful processes running continuously — connection pooling, warm starts, persistent connections.",
    softwareExamples: [
      "Database connection pooling to avoid reconnection overhead",
      "Keep-alive HTTP connections for reduced handshake latency",
      "Pre-warmed Lambda/serverless instances to avoid cold starts",
    ],
  },
  {
    id: 21, name: "Rushing Through / Fast-Fail",
    description: "Perform operations at high speed to avoid harmful effects — fast-fail validation, short-circuit evaluation, circuit breakers.",
    softwareExamples: [
      "Short-circuit evaluation in validation chains (fail fast on first error)",
      "Circuit breaker pattern that quickly rejects requests to failing services",
      "Quick schema validation before expensive business logic processing",
    ],
  },
  {
    id: 22, name: "Convert Harm to Benefit",
    description: "Use harmful factors to achieve positive effects — turn errors into monitoring data, retry storms into backpressure signals.",
    softwareExamples: [
      "Error logs aggregated into alerting dashboards and anomaly detection",
      "Failed request patterns used to identify and mitigate DDoS attacks",
      "Cache misses used to pre-populate future cache entries (cache warming)",
    ],
  },
  {
    id: 23, name: "Feedback",
    description: "Introduce or improve feedback mechanisms — closed-loop autoscaling, adaptive rate limiting, ML feedback loops.",
    softwareExamples: [
      "Closed-loop autoscaling based on real-time metrics",
      "Adaptive rate limiting that adjusts based on system load",
      "Reinforcement learning with human feedback (RLHF) for model improvement",
    ],
  },
  {
    id: 24, name: "Mediator / Intermediary",
    description: "Use an intermediate entity to transfer or carry out an action — message brokers, API gateways, proxy services.",
    softwareExamples: [
      "Message queue (RabbitMQ, SQS) decoupling producers from consumers",
      "Reverse proxy (nginx) handling TLS termination and load balancing",
      "Data transformation middleware between incompatible systems",
    ],
  },
  {
    id: 25, name: "Self-Service",
    description: "Make the system serve itself — self-provisioning, auto-remediation, self-documenting APIs.",
    softwareExamples: [
      "Infrastructure as Code: systems provision themselves from declarative specs",
      "Self-documenting APIs via OpenAPI/Swagger auto-generation",
      "Auto-remediation runbooks triggered by monitoring alerts",
    ],
  },
  {
    id: 26, name: "Copying",
    description: "Use copies instead of originals — read replicas, CDN edge copies, model ensembles, shadow traffic.",
    softwareExamples: [
      "Shadow traffic: copy production requests to test new service versions",
      "CDN edge caches serving copies of static assets globally",
      "Database read replicas distributing query load away from the primary",
    ],
  },
  {
    id: 27, name: "Cheap Short-Living Objects",
    description: "Replace expensive, long-lived resources with cheap, disposable ones — ephemeral containers, spot instances, serverless.",
    softwareExamples: [
      "Spot/preemptible instances for fault-tolerant batch processing",
      "Ephemeral preview environments spun up per pull request",
      "Serverless functions: zero cost at zero traffic, pay per invocation",
    ],
  },
  {
    id: 28, name: "Replace Mechanical System",
    description: "Replace a rigid mechanism with a more flexible one — polling with webhooks, monolith with event-driven, manual with automated.",
    softwareExamples: [
      "Replace polling with webhooks/push notifications",
      "Replace monolithic deploys with event-driven microservices",
      "Replace manual QA with automated test suites and CI/CD pipelines",
    ],
  },
  {
    id: 29, name: "Pneumatics / Hydraulics (Lightweight Protocols)",
    description: "Use lightweight, efficient protocols instead of heavy ones — gRPC over REST, protobuf over JSON, binary over text.",
    softwareExamples: [
      "gRPC with Protocol Buffers instead of JSON REST for inter-service communication",
      "MessagePack or CBOR instead of JSON for bandwidth-sensitive mobile apps",
      "Binary WebSocket frames instead of text for real-time data streams",
    ],
  },
  {
    id: 30, name: "Flexible Membranes / Boundaries",
    description: "Use flexible boundaries that can be adjusted — feature flags, A/B test boundaries, tenant isolation walls, rate limit tiers.",
    softwareExamples: [
      "Feature flags controlling gradual rollout percentages",
      "A/B test traffic splitting with dynamic allocation",
      "Tenant-specific resource quotas adjustable without redeployment",
    ],
  },
  {
    id: 31, name: "Porous Materials / Selective Filtering",
    description: "Add selective permeability — cache layers with TTL, bloom filters, leaky bucket rate limiters, data sampling.",
    softwareExamples: [
      "Bloom filters to quickly reject non-members before expensive lookups",
      "Leaky bucket rate limiters allowing burst while maintaining average rate",
      "Log sampling: store 10% of debug logs, 100% of error logs",
    ],
  },
  {
    id: 32, name: "Color Changes / Mode Switching",
    description: "Change observable properties without changing substance — dynamic logging levels, debug toggles, observability modes.",
    softwareExamples: [
      "Dynamic log level changes in production without redeployment",
      "Debug mode toggle that enables verbose tracing for specific requests",
      "Dark launch: feature is deployed but UI is hidden until flag is flipped",
    ],
  },
  {
    id: 33, name: "Homogeneity / Standardization",
    description: "Standardize on one protocol, format, or approach across services — unified API schemas, consistent error handling.",
    softwareExamples: [
      "Company-wide API design standards (REST conventions, error format)",
      "Shared protobuf/OpenAPI schemas across all microservices",
      "Standardized logging format (structured JSON) across all services",
    ],
  },
  {
    id: 34, name: "Discarding / Recovering",
    description: "Discard and recover rather than repair — immutable infrastructure, blue-green deploys, snapshot & rollback.",
    softwareExamples: [
      "Immutable infrastructure: replace servers instead of patching them",
      "Blue-green deployments: switch traffic, rollback by switching back",
      "Database point-in-time recovery from automated snapshots",
    ],
  },
  {
    id: 35, name: "Parameter Changes / Hot Config",
    description: "Change system parameters at runtime without restarting — feature flags, hot-reload, dynamic configuration.",
    softwareExamples: [
      "Runtime configuration changes via config servers (Consul, etcd)",
      "Hot module replacement in development builds",
      "Dynamic feature flag changes affecting behavior without redeployment",
    ],
  },
  {
    id: 36, name: "Phase Transition / State Machines",
    description: "Use state transitions to manage complex workflows — saga patterns, state machines, workflow engines.",
    softwareExamples: [
      "Saga pattern for distributed transactions across microservices",
      "Order processing state machine: created → paid → shipped → delivered",
      "Workflow engines (Temporal, Step Functions) for complex multi-step processes",
    ],
  },
  {
    id: 37, name: "Thermal Expansion / Auto-Scaling",
    description: "System expands to handle load and contracts when idle — auto-scaling, elastic compute, burst capacity.",
    softwareExamples: [
      "Horizontal pod autoscaling based on CPU/memory metrics",
      "Serverless auto-scaling to zero when idle",
      "Cloud burst: overflow to public cloud when private capacity is exhausted",
    ],
  },
  {
    id: 38, name: "Accelerated Oxidation / Stress Testing",
    description: "Intentionally accelerate failure to find weaknesses — chaos engineering, load testing, fuzz testing.",
    softwareExamples: [
      "Chaos engineering: randomly kill instances to verify resilience",
      "Load testing to 10x expected traffic to find breaking points",
      "Fuzz testing: send random/malformed inputs to find edge cases",
    ],
  },
  {
    id: 39, name: "Inert Environment / Sandboxing",
    description: "Create isolated, safe environments — sandboxing, containerization, network isolation, air-gapped deployments.",
    softwareExamples: [
      "Container sandboxing with restricted system call access (seccomp)",
      "Network segmentation isolating production from development",
      "Air-gapped environments for sensitive workloads (compliance, security)",
    ],
  },
  {
    id: 40, name: "Composite Materials / Polyglot Systems",
    description: "Combine different technologies for optimal results — polyglot persistence, hybrid cloud, multi-model databases.",
    softwareExamples: [
      "Polyglot persistence: SQL for transactions, Redis for cache, Elasticsearch for search",
      "Hybrid cloud: sensitive data on-premise, burst compute in public cloud",
      "Multi-model databases combining document, graph, and key-value access patterns",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// CONTRADICTION MATRIX
// Combines original sparse entries + full XLSX workshop matrix data
// Each entry: improving parameter ID -> worsening parameter ID -> suggested principle IDs
// ═══════════════════════════════════════════════════════════════════
export const CONTRADICTION_MATRIX: ContradictionEntry[] = [
  // ── Response Latency (1) improved ──────────────────────────────
  { improvingParam: 1, worseningParam: 2, suggestedPrinciples: [4, 3, 9] },   // latency vs consistency
  { improvingParam: 1, worseningParam: 3, suggestedPrinciples: [16, 4, 13] }, // latency vs throughput (XLSX)
  { improvingParam: 1, worseningParam: 4, suggestedPrinciples: [4, 11, 5] },  // latency vs cost
  { improvingParam: 1, worseningParam: 5, suggestedPrinciples: [4, 5, 6] },   // latency vs query performance
  { improvingParam: 1, worseningParam: 6, suggestedPrinciples: [4, 9, 3] },   // latency vs data freshness
  { improvingParam: 1, worseningParam: 7, suggestedPrinciples: [1, 4, 37] },  // latency vs scalability (XLSX)
  { improvingParam: 1, worseningParam: 9, suggestedPrinciples: [9, 14, 7] },  // latency vs fault tolerance
  { improvingParam: 1, worseningParam: 10, suggestedPrinciples: [4, 6, 1] },  // latency vs infra complexity
  { improvingParam: 1, worseningParam: 16, suggestedPrinciples: [4, 15, 6] }, // latency vs code quality
  { improvingParam: 1, worseningParam: 17, suggestedPrinciples: [16, 9, 5] }, // latency vs accuracy (XLSX)
  { improvingParam: 1, worseningParam: 24, suggestedPrinciples: [4, 3, 9] },  // latency vs sync complexity
  { improvingParam: 1, worseningParam: 25, suggestedPrinciples: [8, 11, 1] }, // latency vs observability
  { improvingParam: 1, worseningParam: 26, suggestedPrinciples: [5, 4, 11] }, // latency vs perf overhead
  { improvingParam: 1, worseningParam: 31, suggestedPrinciples: [4, 31, 16] }, // latency vs memory (XLSX)
  { improvingParam: 1, worseningParam: 32, suggestedPrinciples: [4, 31, 1] }, // latency vs storage (XLSX)
  { improvingParam: 1, worseningParam: 33, suggestedPrinciples: [16, 21, 4] }, // latency vs security (XLSX)
  { improvingParam: 1, worseningParam: 34, suggestedPrinciples: [20, 4, 29] }, // latency vs real-time perf (XLSX)
  { improvingParam: 1, worseningParam: 35, suggestedPrinciples: [14, 9, 37] }, // latency vs availability (XLSX)

  // ── Data Consistency (2) improved ──────────────────────────────
  { improvingParam: 2, worseningParam: 1, suggestedPrinciples: [3, 12, 14] },  // consistency vs latency
  { improvingParam: 2, worseningParam: 3, suggestedPrinciples: [3, 12, 6] },   // consistency vs throughput
  { improvingParam: 2, worseningParam: 4, suggestedPrinciples: [14, 9, 11] },  // consistency vs cost
  { improvingParam: 2, worseningParam: 6, suggestedPrinciples: [3, 12, 10] },  // consistency vs freshness
  { improvingParam: 2, worseningParam: 7, suggestedPrinciples: [14, 3, 6] },   // consistency vs scalability
  { improvingParam: 2, worseningParam: 15, suggestedPrinciples: [13, 15, 6] }, // consistency vs dev velocity
  { improvingParam: 2, worseningParam: 31, suggestedPrinciples: [14, 36, 3] }, // consistency vs memory (XLSX)
  { improvingParam: 2, worseningParam: 32, suggestedPrinciples: [14, 19, 3] }, // consistency vs storage (XLSX)
  { improvingParam: 2, worseningParam: 33, suggestedPrinciples: [39, 33, 14] }, // consistency vs security (XLSX)
  { improvingParam: 2, worseningParam: 34, suggestedPrinciples: [20, 3, 36] }, // consistency vs real-time (XLSX)
  { improvingParam: 2, worseningParam: 35, suggestedPrinciples: [14, 3, 36] }, // consistency vs availability (XLSX)

  // ── Throughput (3) improved ────────────────────────────────────
  { improvingParam: 3, worseningParam: 1, suggestedPrinciples: [12, 1, 4] },   // throughput vs latency
  { improvingParam: 3, worseningParam: 2, suggestedPrinciples: [9, 3, 12] },   // throughput vs consistency
  { improvingParam: 3, worseningParam: 4, suggestedPrinciples: [11, 1, 8] },   // throughput vs cost
  { improvingParam: 3, worseningParam: 5, suggestedPrinciples: [1, 4, 12] },   // throughput vs query perf
  { improvingParam: 3, worseningParam: 9, suggestedPrinciples: [14, 7, 6] },   // throughput vs fault tolerance
  { improvingParam: 3, worseningParam: 10, suggestedPrinciples: [1, 6, 13] },  // throughput vs complexity
  { improvingParam: 3, worseningParam: 16, suggestedPrinciples: [13, 15, 10] }, // throughput vs code quality
  { improvingParam: 3, worseningParam: 31, suggestedPrinciples: [1, 19, 31] }, // throughput vs memory (XLSX)
  { improvingParam: 3, worseningParam: 32, suggestedPrinciples: [19, 1, 31] }, // throughput vs storage (XLSX)
  { improvingParam: 3, worseningParam: 33, suggestedPrinciples: [21, 39, 1] }, // throughput vs security (XLSX)
  { improvingParam: 3, worseningParam: 34, suggestedPrinciples: [20, 37, 1] }, // throughput vs real-time (XLSX)
  { improvingParam: 3, worseningParam: 35, suggestedPrinciples: [14, 37, 7] }, // throughput vs availability (XLSX)

  // ── Resource Cost (4) improved ─────────────────────────────────
  { improvingParam: 4, worseningParam: 1, suggestedPrinciples: [4, 9, 5] },    // cost vs latency
  { improvingParam: 4, worseningParam: 2, suggestedPrinciples: [9, 16, 3] },   // cost vs consistency (XLSX)
  { improvingParam: 4, worseningParam: 3, suggestedPrinciples: [8, 11, 1] },   // cost vs throughput
  { improvingParam: 4, worseningParam: 5, suggestedPrinciples: [4, 11, 9] },   // cost vs query performance
  { improvingParam: 4, worseningParam: 7, suggestedPrinciples: [11, 8, 1] },   // cost vs scalability
  { improvingParam: 4, worseningParam: 9, suggestedPrinciples: [11, 9, 7] },   // cost vs fault tolerance
  { improvingParam: 4, worseningParam: 17, suggestedPrinciples: [11, 5, 8] },  // cost vs model accuracy
  { improvingParam: 4, worseningParam: 25, suggestedPrinciples: [8, 11, 1] },  // cost vs observability
  { improvingParam: 4, worseningParam: 31, suggestedPrinciples: [27, 11, 31] }, // cost vs memory (XLSX)
  { improvingParam: 4, worseningParam: 32, suggestedPrinciples: [27, 11, 34] }, // cost vs storage (XLSX)
  { improvingParam: 4, worseningParam: 33, suggestedPrinciples: [27, 39, 11] }, // cost vs security (XLSX)
  { improvingParam: 4, worseningParam: 34, suggestedPrinciples: [27, 16, 37] }, // cost vs real-time (XLSX)
  { improvingParam: 4, worseningParam: 35, suggestedPrinciples: [27, 14, 37] }, // cost vs availability (XLSX)

  // ── Query Performance (5) improved ─────────────────────────────
  { improvingParam: 5, worseningParam: 1, suggestedPrinciples: [4, 3, 14] },   // query perf vs latency
  { improvingParam: 5, worseningParam: 2, suggestedPrinciples: [3, 4, 9] },    // query perf vs consistency
  { improvingParam: 5, worseningParam: 4, suggestedPrinciples: [4, 11, 5] },   // query perf vs cost
  { improvingParam: 5, worseningParam: 6, suggestedPrinciples: [4, 12, 3] },   // query perf vs data freshness
  { improvingParam: 5, worseningParam: 10, suggestedPrinciples: [4, 1, 6] },   // query perf vs complexity
  { improvingParam: 5, worseningParam: 16, suggestedPrinciples: [13, 4, 15] }, // query perf vs code quality
  { improvingParam: 5, worseningParam: 22, suggestedPrinciples: [4, 13, 11] }, // query perf vs maintenance
  { improvingParam: 5, worseningParam: 29, suggestedPrinciples: [3, 13, 9] },  // query perf vs schema rigidity

  // ── Data Freshness (6) improved ────────────────────────────────
  { improvingParam: 6, worseningParam: 1, suggestedPrinciples: [20, 17, 4] },  // freshness vs latency (XLSX)
  { improvingParam: 6, worseningParam: 2, suggestedPrinciples: [12, 3, 9] },   // freshness vs consistency
  { improvingParam: 6, worseningParam: 3, suggestedPrinciples: [17, 19, 1] },  // freshness vs throughput (XLSX)
  { improvingParam: 6, worseningParam: 4, suggestedPrinciples: [12, 8, 11] },  // freshness vs cost
  { improvingParam: 6, worseningParam: 5, suggestedPrinciples: [12, 4, 8] },   // freshness vs query performance
  { improvingParam: 6, worseningParam: 10, suggestedPrinciples: [12, 6, 1] },  // freshness vs complexity
  { improvingParam: 6, worseningParam: 26, suggestedPrinciples: [12, 8, 9] },  // freshness vs perf overhead
  { improvingParam: 6, worseningParam: 31, suggestedPrinciples: [17, 31, 19] }, // freshness vs memory (XLSX)
  { improvingParam: 6, worseningParam: 32, suggestedPrinciples: [17, 19, 34] }, // freshness vs storage (XLSX)
  { improvingParam: 6, worseningParam: 33, suggestedPrinciples: [17, 39, 33] }, // freshness vs security (XLSX)
  { improvingParam: 6, worseningParam: 34, suggestedPrinciples: [20, 17, 29] }, // freshness vs real-time (XLSX)
  { improvingParam: 6, worseningParam: 35, suggestedPrinciples: [14, 17, 37] }, // freshness vs availability (XLSX)

  // ── Horizontal Scalability (7) improved ────────────────────────
  { improvingParam: 7, worseningParam: 1, suggestedPrinciples: [37, 4, 1] },   // scalability vs latency (XLSX)
  { improvingParam: 7, worseningParam: 2, suggestedPrinciples: [3, 9, 12] },   // scalability vs consistency
  { improvingParam: 7, worseningParam: 3, suggestedPrinciples: [37, 1, 14] },  // scalability vs throughput (XLSX)
  { improvingParam: 7, worseningParam: 4, suggestedPrinciples: [11, 8, 1] },   // scalability vs cost
  { improvingParam: 7, worseningParam: 10, suggestedPrinciples: [1, 6, 13] },  // scalability vs complexity
  { improvingParam: 7, worseningParam: 16, suggestedPrinciples: [13, 15, 1] }, // scalability vs code quality
  { improvingParam: 7, worseningParam: 24, suggestedPrinciples: [3, 12, 9] },  // scalability vs sync
  { improvingParam: 7, worseningParam: 27, suggestedPrinciples: [1, 13, 6] },  // scalability vs multi-tenancy
  { improvingParam: 7, worseningParam: 31, suggestedPrinciples: [1, 37, 31] }, // scalability vs memory (XLSX)
  { improvingParam: 7, worseningParam: 32, suggestedPrinciples: [1, 37, 34] }, // scalability vs storage (XLSX)
  { improvingParam: 7, worseningParam: 33, suggestedPrinciples: [39, 1, 33] }, // scalability vs security (XLSX)
  { improvingParam: 7, worseningParam: 34, suggestedPrinciples: [37, 20, 1] }, // scalability vs real-time (XLSX)
  { improvingParam: 7, worseningParam: 35, suggestedPrinciples: [14, 37, 7] }, // scalability vs availability (XLSX)

  // ── Predictable Costs (8) improved ─────────────────────────────
  { improvingParam: 8, worseningParam: 1, suggestedPrinciples: [4, 9, 8] },    // predictable costs vs latency
  { improvingParam: 8, worseningParam: 3, suggestedPrinciples: [8, 11, 9] },   // predictable costs vs throughput
  { improvingParam: 8, worseningParam: 7, suggestedPrinciples: [8, 11, 1] },   // predictable costs vs scalability

  // ── Fault Tolerance (9) improved ───────────────────────────────
  { improvingParam: 9, worseningParam: 1, suggestedPrinciples: [14, 7, 9] },   // fault tol vs latency
  { improvingParam: 9, worseningParam: 2, suggestedPrinciples: [14, 36, 3] },  // fault tol vs consistency (XLSX)
  { improvingParam: 9, worseningParam: 3, suggestedPrinciples: [14, 7, 1] },   // fault tol vs throughput
  { improvingParam: 9, worseningParam: 4, suggestedPrinciples: [11, 7, 9] },   // fault tol vs cost
  { improvingParam: 9, worseningParam: 10, suggestedPrinciples: [7, 6, 15] },  // fault tol vs complexity
  { improvingParam: 9, worseningParam: 15, suggestedPrinciples: [7, 10, 15] }, // fault tol vs dev velocity
  { improvingParam: 9, worseningParam: 31, suggestedPrinciples: [14, 27, 31] }, // fault tol vs memory (XLSX)
  { improvingParam: 9, worseningParam: 32, suggestedPrinciples: [14, 34, 19] }, // fault tol vs storage (XLSX)
  { improvingParam: 9, worseningParam: 33, suggestedPrinciples: [39, 14, 7] }, // fault tol vs security (XLSX)
  { improvingParam: 9, worseningParam: 34, suggestedPrinciples: [14, 20, 37] }, // fault tol vs real-time (XLSX)

  // ── Infrastructure Complexity (10) improved ────────────────────
  { improvingParam: 10, worseningParam: 1, suggestedPrinciples: [13, 5, 4] },  // reduce complexity vs latency
  { improvingParam: 10, worseningParam: 7, suggestedPrinciples: [13, 1, 6] },  // reduce complexity vs scalability
  { improvingParam: 10, worseningParam: 9, suggestedPrinciples: [7, 13, 15] }, // reduce complexity vs fault tol
  { improvingParam: 10, worseningParam: 33, suggestedPrinciples: [33, 13, 39] }, // complexity vs security (XLSX)
  { improvingParam: 10, worseningParam: 34, suggestedPrinciples: [13, 33, 20] }, // complexity vs real-time (XLSX)
  { improvingParam: 10, worseningParam: 35, suggestedPrinciples: [13, 7, 14] }, // complexity vs availability (XLSX)

  // ── Authentication Strength (11) improved ──────────────────────
  { improvingParam: 11, worseningParam: 1, suggestedPrinciples: [4, 6, 5] },   // auth strength vs latency
  { improvingParam: 11, worseningParam: 12, suggestedPrinciples: [8, 6, 13] }, // auth strength vs user friction
  { improvingParam: 11, worseningParam: 15, suggestedPrinciples: [13, 6, 15] }, // auth strength vs dev velocity

  // ── User Friction (12) improved ────────────────────────────────
  { improvingParam: 12, worseningParam: 11, suggestedPrinciples: [8, 6, 13] }, // reduce friction vs auth strength
  { improvingParam: 12, worseningParam: 20, suggestedPrinciples: [2, 8, 6] },  // reduce friction vs privacy

  // ── Feature Completeness (13) improved ─────────────────────────
  { improvingParam: 13, worseningParam: 14, suggestedPrinciples: [15, 8, 9] }, // completeness vs UX simplicity
  { improvingParam: 13, worseningParam: 15, suggestedPrinciples: [1, 13, 15] }, // completeness vs dev velocity
  { improvingParam: 13, worseningParam: 22, suggestedPrinciples: [1, 15, 13] }, // completeness vs maintenance

  // ── UX Simplicity (14) improved ────────────────────────────────
  { improvingParam: 14, worseningParam: 13, suggestedPrinciples: [9, 8, 15] }, // simplicity vs completeness
  { improvingParam: 14, worseningParam: 28, suggestedPrinciples: [8, 13, 15] }, // simplicity vs customization

  // ── Development Velocity (15) improved ─────────────────────────
  { improvingParam: 15, worseningParam: 9, suggestedPrinciples: [10, 7, 15] }, // velocity vs fault tolerance
  { improvingParam: 15, worseningParam: 10, suggestedPrinciples: [13, 1, 6] }, // velocity vs complexity
  { improvingParam: 15, worseningParam: 16, suggestedPrinciples: [10, 15, 13] }, // velocity vs quality
  { improvingParam: 15, worseningParam: 22, suggestedPrinciples: [15, 13, 11] }, // velocity vs maintenance
  { improvingParam: 15, worseningParam: 29, suggestedPrinciples: [13, 8, 12] }, // velocity vs schema rigidity

  // ── Code Quality / Maintainability (16) improved ──────────────
  { improvingParam: 16, worseningParam: 1, suggestedPrinciples: [33, 15, 10] }, // quality vs latency (XLSX)
  { improvingParam: 16, worseningParam: 3, suggestedPrinciples: [33, 13, 15] }, // quality vs throughput (XLSX)
  { improvingParam: 16, worseningParam: 4, suggestedPrinciples: [10, 13, 15] }, // quality vs cost
  { improvingParam: 16, worseningParam: 15, suggestedPrinciples: [10, 15, 13] }, // quality vs velocity
  { improvingParam: 16, worseningParam: 30, suggestedPrinciples: [10, 7, 15] }, // quality vs deploy frequency
  { improvingParam: 16, worseningParam: 33, suggestedPrinciples: [33, 39, 15] }, // quality vs security (XLSX)
  { improvingParam: 16, worseningParam: 34, suggestedPrinciples: [33, 13, 20] }, // quality vs real-time (XLSX)
  { improvingParam: 16, worseningParam: 35, suggestedPrinciples: [33, 7, 14] }, // quality vs availability (XLSX)

  // ── Model Accuracy (17) improved ───────────────────────────────
  { improvingParam: 17, worseningParam: 1, suggestedPrinciples: [16, 9, 5] },  // accuracy vs latency (XLSX)
  { improvingParam: 17, worseningParam: 3, suggestedPrinciples: [1, 19, 16] }, // accuracy vs throughput (XLSX)
  { improvingParam: 17, worseningParam: 4, suggestedPrinciples: [11, 8, 5] },  // accuracy vs cost
  { improvingParam: 17, worseningParam: 18, suggestedPrinciples: [5, 1, 9] },  // accuracy vs inference latency
  { improvingParam: 17, worseningParam: 19, suggestedPrinciples: [13, 14, 8] }, // accuracy vs training data
  { improvingParam: 17, worseningParam: 20, suggestedPrinciples: [2, 5, 13] }, // accuracy vs privacy
  { improvingParam: 17, worseningParam: 31, suggestedPrinciples: [1, 16, 31] }, // accuracy vs memory (XLSX)
  { improvingParam: 17, worseningParam: 32, suggestedPrinciples: [1, 19, 34] }, // accuracy vs storage (XLSX)
  { improvingParam: 17, worseningParam: 33, suggestedPrinciples: [39, 2, 33] }, // accuracy vs security (XLSX)
  { improvingParam: 17, worseningParam: 34, suggestedPrinciples: [16, 5, 20] }, // accuracy vs real-time (XLSX)
  { improvingParam: 17, worseningParam: 35, suggestedPrinciples: [14, 7, 40] }, // accuracy vs availability (XLSX)

  // ── Inference Latency (18) improved ────────────────────────────
  { improvingParam: 18, worseningParam: 4, suggestedPrinciples: [5, 11, 4] },  // inference vs cost
  { improvingParam: 18, worseningParam: 17, suggestedPrinciples: [1, 9, 5] },  // inference vs accuracy

  // ── Training Data Volume (19) improved ─────────────────────────
  { improvingParam: 19, worseningParam: 4, suggestedPrinciples: [11, 8, 13] }, // training data vs cost
  { improvingParam: 19, worseningParam: 20, suggestedPrinciples: [2, 5, 13] }, // training data vs privacy

  // ── Privacy Preservation (20) improved ─────────────────────────
  { improvingParam: 20, worseningParam: 6, suggestedPrinciples: [2, 9, 6] },   // privacy vs data freshness
  { improvingParam: 20, worseningParam: 12, suggestedPrinciples: [8, 2, 6] },  // privacy vs user friction
  { improvingParam: 20, worseningParam: 17, suggestedPrinciples: [2, 5, 13] }, // privacy vs accuracy

  // ── API Surface Area (21) improved ─────────────────────────────
  { improvingParam: 21, worseningParam: 11, suggestedPrinciples: [6, 13, 2] }, // API surface vs auth strength
  { improvingParam: 21, worseningParam: 22, suggestedPrinciples: [13, 15, 1] }, // API surface vs maintenance

  // ── Maintenance Burden (22) improved ───────────────────────────
  { improvingParam: 22, worseningParam: 13, suggestedPrinciples: [1, 15, 13] }, // maintenance vs features
  { improvingParam: 22, worseningParam: 15, suggestedPrinciples: [15, 13, 10] }, // maintenance vs velocity

  // ── Offline Capability (23) improved ───────────────────────────
  { improvingParam: 23, worseningParam: 2, suggestedPrinciples: [3, 9, 12] },   // offline vs consistency
  { improvingParam: 23, worseningParam: 24, suggestedPrinciples: [3, 9, 10] }, // offline vs sync complexity

  // ── Sync Complexity (24) improved ──────────────────────────────
  { improvingParam: 24, worseningParam: 2, suggestedPrinciples: [9, 3, 12] },  // reduce sync complexity vs consistency
  { improvingParam: 24, worseningParam: 6, suggestedPrinciples: [12, 9, 4] },  // reduce sync complexity vs freshness

  // ── Observability Depth (25) improved ──────────────────────────
  { improvingParam: 25, worseningParam: 1, suggestedPrinciples: [32, 31, 19] }, // observability vs latency (XLSX)
  { improvingParam: 25, worseningParam: 3, suggestedPrinciples: [32, 19, 31] }, // observability vs throughput (XLSX)
  { improvingParam: 25, worseningParam: 4, suggestedPrinciples: [11, 8, 1] },  // observability vs cost
  { improvingParam: 25, worseningParam: 26, suggestedPrinciples: [8, 11, 1] }, // observability vs perf overhead
  { improvingParam: 25, worseningParam: 31, suggestedPrinciples: [32, 31, 19] }, // observability vs memory (XLSX)
  { improvingParam: 25, worseningParam: 32, suggestedPrinciples: [32, 19, 34] }, // observability vs storage (XLSX)
  { improvingParam: 25, worseningParam: 33, suggestedPrinciples: [32, 39, 33] }, // observability vs security (XLSX)
  { improvingParam: 25, worseningParam: 34, suggestedPrinciples: [32, 19, 20] }, // observability vs real-time (XLSX)

  // ── Performance Overhead (26) improved ─────────────────────────
  { improvingParam: 26, worseningParam: 25, suggestedPrinciples: [8, 11, 1] }, // reduce overhead vs observability
  { improvingParam: 26, worseningParam: 11, suggestedPrinciples: [4, 5, 6] },  // reduce overhead vs auth strength

  // ── Multi-tenancy Isolation (27) improved ──────────────────────
  { improvingParam: 27, worseningParam: 4, suggestedPrinciples: [1, 13, 11] }, // isolation vs cost
  { improvingParam: 27, worseningParam: 7, suggestedPrinciples: [1, 6, 13] },  // isolation vs scalability
  { improvingParam: 27, worseningParam: 10, suggestedPrinciples: [1, 6, 15] }, // isolation vs complexity

  // ── Customization Flexibility (28) improved ────────────────────
  { improvingParam: 28, worseningParam: 14, suggestedPrinciples: [8, 15, 13] }, // customization vs UX simplicity
  { improvingParam: 28, worseningParam: 22, suggestedPrinciples: [15, 13, 1] }, // customization vs maintenance

  // ── Schema Rigidity (29) improved ──────────────────────────────
  { improvingParam: 29, worseningParam: 5, suggestedPrinciples: [13, 3, 4] },   // schema rigidity vs query perf
  { improvingParam: 29, worseningParam: 15, suggestedPrinciples: [13, 8, 12] }, // schema rigidity vs dev velocity

  // ── Deployment Frequency (30) improved ─────────────────────────
  { improvingParam: 30, worseningParam: 9, suggestedPrinciples: [10, 7, 15] },  // deploy freq vs fault tolerance
  { improvingParam: 30, worseningParam: 16, suggestedPrinciples: [10, 15, 7] }, // deploy freq vs code quality
  { improvingParam: 30, worseningParam: 22, suggestedPrinciples: [10, 7, 11] }, // deploy freq vs maintenance

  // ── Memory Usage (31) improved ─────────────────────────────────
  { improvingParam: 31, worseningParam: 1, suggestedPrinciples: [4, 31, 16] },  // memory vs latency (XLSX)
  { improvingParam: 31, worseningParam: 2, suggestedPrinciples: [14, 36, 3] },  // memory vs consistency (XLSX)
  { improvingParam: 31, worseningParam: 3, suggestedPrinciples: [1, 19, 31] },  // memory vs throughput (XLSX)
  { improvingParam: 31, worseningParam: 4, suggestedPrinciples: [27, 11, 31] }, // memory vs cost (XLSX)
  { improvingParam: 31, worseningParam: 6, suggestedPrinciples: [31, 19, 4] },  // memory vs freshness (XLSX)
  { improvingParam: 31, worseningParam: 7, suggestedPrinciples: [1, 37, 31] },  // memory vs scalability (XLSX)
  { improvingParam: 31, worseningParam: 9, suggestedPrinciples: [14, 27, 31] }, // memory vs fault tol (XLSX)
  { improvingParam: 31, worseningParam: 10, suggestedPrinciples: [31, 13, 33] }, // memory vs complexity (XLSX)
  { improvingParam: 31, worseningParam: 16, suggestedPrinciples: [33, 31, 15] }, // memory vs quality (XLSX)
  { improvingParam: 31, worseningParam: 17, suggestedPrinciples: [1, 16, 31] }, // memory vs accuracy (XLSX)
  { improvingParam: 31, worseningParam: 25, suggestedPrinciples: [32, 31, 19] }, // memory vs observability (XLSX)
  { improvingParam: 31, worseningParam: 32, suggestedPrinciples: [31, 34, 19] }, // memory vs storage (XLSX)
  { improvingParam: 31, worseningParam: 33, suggestedPrinciples: [39, 31, 33] }, // memory vs security (XLSX)
  { improvingParam: 31, worseningParam: 34, suggestedPrinciples: [31, 20, 29] }, // memory vs real-time (XLSX)
  { improvingParam: 31, worseningParam: 35, suggestedPrinciples: [14, 31, 37] }, // memory vs availability (XLSX)

  // ── Storage Footprint (32) improved ────────────────────────────
  { improvingParam: 32, worseningParam: 1, suggestedPrinciples: [4, 31, 1] },   // storage vs latency (XLSX)
  { improvingParam: 32, worseningParam: 2, suggestedPrinciples: [14, 19, 3] },  // storage vs consistency (XLSX)
  { improvingParam: 32, worseningParam: 3, suggestedPrinciples: [19, 1, 31] },  // storage vs throughput (XLSX)
  { improvingParam: 32, worseningParam: 4, suggestedPrinciples: [27, 11, 34] }, // storage vs cost (XLSX)
  { improvingParam: 32, worseningParam: 6, suggestedPrinciples: [19, 34, 17] }, // storage vs freshness (XLSX)
  { improvingParam: 32, worseningParam: 7, suggestedPrinciples: [1, 37, 34] },  // storage vs scalability (XLSX)
  { improvingParam: 32, worseningParam: 9, suggestedPrinciples: [14, 34, 19] }, // storage vs fault tol (XLSX)
  { improvingParam: 32, worseningParam: 10, suggestedPrinciples: [34, 13, 33] }, // storage vs complexity (XLSX)
  { improvingParam: 32, worseningParam: 16, suggestedPrinciples: [33, 34, 15] }, // storage vs quality (XLSX)
  { improvingParam: 32, worseningParam: 17, suggestedPrinciples: [1, 19, 34] }, // storage vs accuracy (XLSX)
  { improvingParam: 32, worseningParam: 25, suggestedPrinciples: [32, 19, 34] }, // storage vs observability (XLSX)
  { improvingParam: 32, worseningParam: 31, suggestedPrinciples: [31, 34, 19] }, // storage vs memory (XLSX)
  { improvingParam: 32, worseningParam: 33, suggestedPrinciples: [39, 34, 33] }, // storage vs security (XLSX)
  { improvingParam: 32, worseningParam: 34, suggestedPrinciples: [34, 20, 29] }, // storage vs real-time (XLSX)
  { improvingParam: 32, worseningParam: 35, suggestedPrinciples: [14, 34, 37] }, // storage vs availability (XLSX)

  // ── Security Posture (33) improved ─────────────────────────────
  { improvingParam: 33, worseningParam: 1, suggestedPrinciples: [16, 21, 4] },  // security vs latency (XLSX)
  { improvingParam: 33, worseningParam: 2, suggestedPrinciples: [39, 33, 14] }, // security vs consistency (XLSX)
  { improvingParam: 33, worseningParam: 3, suggestedPrinciples: [21, 39, 1] },  // security vs throughput (XLSX)
  { improvingParam: 33, worseningParam: 4, suggestedPrinciples: [27, 39, 11] }, // security vs cost (XLSX)
  { improvingParam: 33, worseningParam: 6, suggestedPrinciples: [39, 33, 17] }, // security vs freshness (XLSX)
  { improvingParam: 33, worseningParam: 7, suggestedPrinciples: [39, 1, 33] },  // security vs scalability (XLSX)
  { improvingParam: 33, worseningParam: 9, suggestedPrinciples: [39, 14, 7] },  // security vs fault tol (XLSX)
  { improvingParam: 33, worseningParam: 10, suggestedPrinciples: [33, 13, 39] }, // security vs complexity (XLSX)
  { improvingParam: 33, worseningParam: 16, suggestedPrinciples: [33, 39, 15] }, // security vs quality (XLSX)
  { improvingParam: 33, worseningParam: 17, suggestedPrinciples: [39, 2, 33] }, // security vs accuracy (XLSX)
  { improvingParam: 33, worseningParam: 25, suggestedPrinciples: [32, 39, 33] }, // security vs observability (XLSX)
  { improvingParam: 33, worseningParam: 31, suggestedPrinciples: [39, 31, 33] }, // security vs memory (XLSX)
  { improvingParam: 33, worseningParam: 32, suggestedPrinciples: [39, 34, 33] }, // security vs storage (XLSX)
  { improvingParam: 33, worseningParam: 34, suggestedPrinciples: [39, 21, 20] }, // security vs real-time (XLSX)
  { improvingParam: 33, worseningParam: 35, suggestedPrinciples: [39, 14, 7] }, // security vs availability (XLSX)

  // ── Real-time Performance (34) improved ────────────────────────
  { improvingParam: 34, worseningParam: 1, suggestedPrinciples: [20, 4, 29] },  // real-time vs latency (XLSX)
  { improvingParam: 34, worseningParam: 2, suggestedPrinciples: [20, 3, 36] },  // real-time vs consistency (XLSX)
  { improvingParam: 34, worseningParam: 3, suggestedPrinciples: [20, 37, 1] },  // real-time vs throughput (XLSX)
  { improvingParam: 34, worseningParam: 4, suggestedPrinciples: [27, 16, 37] }, // real-time vs cost (XLSX)
  { improvingParam: 34, worseningParam: 6, suggestedPrinciples: [20, 17, 29] }, // real-time vs freshness (XLSX)
  { improvingParam: 34, worseningParam: 7, suggestedPrinciples: [37, 20, 1] },  // real-time vs scalability (XLSX)
  { improvingParam: 34, worseningParam: 9, suggestedPrinciples: [14, 20, 37] }, // real-time vs fault tol (XLSX)
  { improvingParam: 34, worseningParam: 10, suggestedPrinciples: [13, 33, 20] }, // real-time vs complexity (XLSX)
  { improvingParam: 34, worseningParam: 16, suggestedPrinciples: [33, 13, 20] }, // real-time vs quality (XLSX)
  { improvingParam: 34, worseningParam: 17, suggestedPrinciples: [16, 5, 20] }, // real-time vs accuracy (XLSX)
  { improvingParam: 34, worseningParam: 25, suggestedPrinciples: [32, 19, 20] }, // real-time vs observability (XLSX)
  { improvingParam: 34, worseningParam: 31, suggestedPrinciples: [31, 20, 29] }, // real-time vs memory (XLSX)
  { improvingParam: 34, worseningParam: 32, suggestedPrinciples: [34, 20, 29] }, // real-time vs storage (XLSX)
  { improvingParam: 34, worseningParam: 33, suggestedPrinciples: [39, 21, 20] }, // real-time vs security (XLSX)
  { improvingParam: 34, worseningParam: 35, suggestedPrinciples: [14, 20, 37] }, // real-time vs availability (XLSX)

  // ── Service Availability (35) improved ─────────────────────────
  { improvingParam: 35, worseningParam: 1, suggestedPrinciples: [14, 9, 37] },  // availability vs latency (XLSX)
  { improvingParam: 35, worseningParam: 2, suggestedPrinciples: [14, 3, 36] },  // availability vs consistency (XLSX)
  { improvingParam: 35, worseningParam: 3, suggestedPrinciples: [14, 37, 7] },  // availability vs throughput (XLSX)
  { improvingParam: 35, worseningParam: 4, suggestedPrinciples: [27, 14, 37] }, // availability vs cost (XLSX)
  { improvingParam: 35, worseningParam: 6, suggestedPrinciples: [14, 17, 37] }, // availability vs freshness (XLSX)
  { improvingParam: 35, worseningParam: 7, suggestedPrinciples: [14, 37, 7] },  // availability vs scalability (XLSX)
  { improvingParam: 35, worseningParam: 10, suggestedPrinciples: [13, 7, 14] }, // availability vs complexity (XLSX)
  { improvingParam: 35, worseningParam: 16, suggestedPrinciples: [33, 7, 14] }, // availability vs quality (XLSX)
  { improvingParam: 35, worseningParam: 17, suggestedPrinciples: [14, 7, 40] }, // availability vs accuracy (XLSX)
  { improvingParam: 35, worseningParam: 31, suggestedPrinciples: [14, 31, 37] }, // availability vs memory (XLSX)
  { improvingParam: 35, worseningParam: 32, suggestedPrinciples: [14, 34, 37] }, // availability vs storage (XLSX)
  { improvingParam: 35, worseningParam: 33, suggestedPrinciples: [39, 14, 7] }, // availability vs security (XLSX)
  { improvingParam: 35, worseningParam: 34, suggestedPrinciples: [14, 20, 37] }, // availability vs real-time (XLSX)
];

// ═══════════════════════════════════════════════════════════════════
// Helper: Look up principles for a given contradiction
// ═══════════════════════════════════════════════════════════════════
export function lookupContradiction(
  improvingId: number,
  worseningId: number
): SoftwareInventivePrinciple[] {
  const entry = CONTRADICTION_MATRIX.find(
    (e) => e.improvingParam === improvingId && e.worseningParam === worseningId
  );
  if (!entry) return [];
  return entry.suggestedPrinciples
    .map((pid) => SOFTWARE_PRINCIPLES.find((p) => p.id === pid))
    .filter((p): p is SoftwareInventivePrinciple => p !== undefined);
}

/** Get parameter by ID */
export function getParameterById(id: number): SoftwareParameter | undefined {
  return SOFTWARE_PARAMETERS.find((p) => p.id === id);
}

/** Get principle by ID */
export function getPrincipleById(id: number): SoftwareInventivePrinciple | undefined {
  return SOFTWARE_PRINCIPLES.find((p) => p.id === id);
}

/** Get all parameter categories for grouping */
export function getParametersByCategory(): Record<string, SoftwareParameter[]> {
  const groups: Record<string, SoftwareParameter[]> = {};
  for (const param of SOFTWARE_PARAMETERS) {
    if (!groups[param.category]) groups[param.category] = [];
    groups[param.category].push(param);
  }
  return groups;
}
