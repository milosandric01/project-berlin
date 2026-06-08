<template>
  <div class="w-full font-sans">

    <!-- Top bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-gray-900 flex-none" />
        <span class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500 font-medium">{{ flow.path }}</span>
      </div>
      <button
        class="inline-flex items-center gap-1.5 text-[13px] text-gray-400 bg-transparent border-none cursor-pointer font-[inherit] p-0 hover:text-gray-700 transition-colors duration-[120ms]"
        @click="emit('exit', current)"
      >
        <Icon name="lucide:x" :size="14" />
        Exit
      </button>
    </div>

    <!-- Question card -->
    <div class="bg-white rounded-3xl px-[26px] pt-6 pb-5 shadow-sm">

      <!-- Progress segments -->
      <div class="flex items-center gap-1.5 mb-5">
        <div
          v-for="i in totalQuestions"
          :key="i"
          class="h-1 flex-1 rounded-full transition-colors duration-300"
          :class="i - 1 < current ? 'bg-gray-800' : i - 1 === current ? 'bg-gray-400' : 'bg-gray-200'"
        />
        <span class="font-mono text-[11px] text-gray-400 ml-1 flex-none">{{ current + 1 }}/{{ totalQuestions }}</span>
      </div>

      <!-- Prompt type -->
      <div class="font-mono text-[11px] tracking-[0.06em] uppercase text-gray-400 mb-3">
        {{ q.type }}
      </div>

      <!-- Question -->
      <h2 class="text-[20px] font-medium leading-snug tracking-[-0.01em] text-gray-900 mb-5 max-w-[48ch]">
        {{ q.text }}
      </h2>

      <!-- Context block (optional) -->
      <div v-if="q.context" class="bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 mb-5 text-[13px] text-gray-600 leading-relaxed font-mono whitespace-pre-wrap">{{ q.context }}</div>

      <!-- Answer area -->
      <textarea
        v-model="answers[current]"
        :placeholder="q.placeholder"
        class="w-full min-h-[120px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13.5px] text-gray-900 leading-relaxed resize-none outline-none font-[inherit] placeholder:text-gray-400 focus:border-gray-400 transition-colors duration-[120ms]"
      />

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 mt-1">
        <button
          v-if="current > 0"
          class="inline-flex items-center gap-[7px] text-[13px] text-gray-500 bg-transparent border-none cursor-pointer font-[inherit] p-0 hover:text-gray-900 transition-colors duration-[120ms]"
          @click="back"
        >
          <Icon name="lucide:arrow-left" :size="14" class="text-gray-400" />
          Back
        </button>
        <span v-else />

        <HlButton variant="primary" size="md" @click="next">
          {{ current < totalQuestions - 1 ? 'Next' : 'Finish flow' }}
          <Icon :name="current < totalQuestions - 1 ? 'lucide:arrow-right' : 'lucide:check'" :size="14" />
        </HlButton>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { EssentialFlow } from './FlowPicker.vue'

const props = defineProps<{ flow: EssentialFlow; initialQuestion?: number }>()
const emit = defineEmits<{ exit: [questionIndex: number]; finish: []; questionAnswered: [count: number] }>()

const totalQuestions = 12
const current = ref(props.initialQuestion ?? 0)
const answers = ref<string[]>(Array(totalQuestions).fill(''))
// tracks highest question index reached to avoid double-counting on back/forward
const highWater = ref(props.initialQuestion ?? 0)

interface Question {
  type: string
  text: string
  context?: string
  placeholder: string
}

const questionBank: Record<string, Question[]> = {
  networking: [
    { type: 'Quick Take', text: 'What happens between the moment you type a URL and the page starts rendering in your browser?', placeholder: 'Walk through the steps — DNS, TCP, HTTP…' },
    { type: 'What Would You Do?', text: 'A service you own is timing out for 5% of requests. How do you approach diagnosing whether it\'s a network issue or an application issue?', placeholder: 'Describe your investigation process…' },
    { type: 'Spot the Risk', text: 'Your team is switching all internal service communication from REST over HTTP/1.1 to gRPC. What risks do you see, and how would you mitigate them?', placeholder: 'Think about tooling, debugging, compatibility…' },
    { type: 'Quick Take', text: 'Explain the difference between TCP and UDP. When would you choose UDP over TCP?', placeholder: 'Focus on reliability, ordering, and latency trade-offs…' },
    { type: 'What Would You Do?', text: 'You\'re building a real-time multiplayer game. The server needs to push updates to thousands of clients every 50ms. What transport layer would you use and why?', placeholder: 'Consider WebSockets, SSE, UDP, polling…' },
    { type: 'Quick Take', text: 'What is TLS and what problem does it solve? Walk through a simplified TLS handshake.', placeholder: 'Cover encryption, authentication, and certificate roles…' },
    { type: 'Spot the Risk', text: 'A junior engineer on your team proposes caching DNS responses for 24 hours to improve performance. What could go wrong?', placeholder: 'Think about TTL, failover, and IP changes…' },
    { type: 'What Would You Do?', text: 'Your API is returning slow responses only for users in Southeast Asia. Latency is fine for Europe and the US. What do you investigate first?', placeholder: 'CDN, routing, data center proximity, BGP…' },
    { type: 'Quick Take', text: 'What is HTTP/2 and what advantages does it have over HTTP/1.1?', placeholder: 'Multiplexing, header compression, server push…' },
    { type: 'Spot the Risk', text: 'You\'re asked to expose an internal admin API to the public internet via an nginx reverse proxy. What security concerns would you raise?', placeholder: 'Auth, rate limiting, IP allowlisting, TLS…' },
    { type: 'What Would You Do?', text: 'A DDOS attack is hitting your load balancer. Walk me through how you would respond in the first 30 minutes.', placeholder: 'Detection, mitigation layers, communication…' },
    { type: 'Quick Take', text: 'Explain what a CDN is and describe a scenario where using one could actually make performance worse.', placeholder: 'Think about cache invalidation, dynamic content, geography…' },
  ],
  'system-design': [
    { type: 'What Would You Do?', text: 'Design a URL shortener that needs to handle 100 million requests per day. Walk me through your architecture.', placeholder: 'Storage, hashing, redirects, scaling…' },
    { type: 'Spot the Risk', text: 'Your team is planning to shard your main user database by user_id. What risks do you foresee, and what would you do before the cutover?', placeholder: 'Hot shards, joins, migration, rollback plan…' },
    { type: 'Quick Take', text: 'What is the CAP theorem? Give a concrete example of a system that prioritizes availability over consistency.', placeholder: 'Define each term and give a real-world example…' },
    { type: 'What Would You Do?', text: 'You\'re designing a system that needs to send email notifications when a user takes an action. How do you make this reliable without blocking the main request?', placeholder: 'Queues, retries, idempotency, dead letters…' },
    { type: 'Spot the Risk', text: 'A proposal to use a single Redis instance as both the session store and the rate limiter for your entire platform. What could go wrong?', placeholder: 'Single point of failure, memory, eviction…' },
    { type: 'Quick Take', text: 'What is consistent hashing and why is it useful when adding or removing nodes from a cluster?', placeholder: 'Explain the ring, virtual nodes, and rebalancing…' },
    { type: 'What Would You Do?', text: 'Design a system to process and aggregate analytics events from 10 million active users. Events need to be queryable within 5 minutes.', placeholder: 'Ingestion pipeline, storage, aggregation, latency…' },
    { type: 'Spot the Risk', text: 'Your service calls three downstream APIs in parallel and combines the results. One of them starts timing out intermittently. What happens and how do you fix it?', placeholder: 'Circuit breakers, timeouts, fallbacks…' },
    { type: 'Quick Take', text: 'Explain the difference between horizontal and vertical scaling. When does vertical scaling stop being an option?', placeholder: 'Cost, limits, stateless vs stateful services…' },
    { type: 'What Would You Do?', text: 'You\'re building a feed for a social platform. Some users have 50 followers, others have 5 million. How does that asymmetry affect your design?', placeholder: 'Fan-out strategies, hot users, write vs read paths…' },
    { type: 'Spot the Risk', text: 'Your team wants to add a distributed cache in front of the database to reduce load. What failure modes do you need to plan for?', placeholder: 'Cache stampede, invalidation, cold start, consistency…' },
    { type: 'Quick Take', text: 'What is a message queue and how does it help decouple services? What trade-offs does it introduce?', placeholder: 'Async vs sync, ordering, at-least-once delivery…' },
  ],
  'api-design': [
    { type: 'Quick Take', text: 'What makes an API "RESTful"? Name two common mistakes people make when designing REST APIs.', placeholder: 'Resources, HTTP verbs, statelessness…' },
    { type: 'What Would You Do?', text: 'You need to release a breaking change to a public API that 500 external clients depend on. How do you approach versioning and the migration?', placeholder: 'Versioning strategies, deprecation timeline, communication…' },
    { type: 'Spot the Risk', text: 'A colleague proposes returning HTTP 200 for all responses, including errors, with an error field in the JSON body. What do you think of this approach?', placeholder: 'Caching, middleware, client expectations…' },
    { type: 'Quick Take', text: 'What is idempotency and why is it important in API design? Give an example of an endpoint that should be idempotent.', placeholder: 'Safe retries, duplicate requests, HTTP methods…' },
    { type: 'What Would You Do?', text: 'Your public API is getting hammered by a few clients making thousands of requests per minute. How do you implement rate limiting without breaking well-behaved clients?', placeholder: 'Algorithms, headers, tiers, backoff guidance…' },
    { type: 'Spot the Risk', text: 'Your team is building a new feature and wants to accept a large batch of items in a single API request — up to 10,000 objects per call. What concerns do you raise?', placeholder: 'Timeouts, memory, partial failures, retries…' },
    { type: 'Quick Take', text: 'Compare REST and GraphQL. What problem does GraphQL solve well, and where does it add complexity?', placeholder: 'Over-fetching, N+1 queries, schema evolution…' },
    { type: 'What Would You Do?', text: 'You\'re designing a webhook system for your platform. How do you handle delivery failures, retries, and ensure events aren\'t lost?', placeholder: 'Queuing, exponential backoff, dead letters, idempotency keys…' },
    { type: 'Spot the Risk', text: 'A third-party API your system depends on has no SLA and frequently returns inconsistent error codes. How do you design around this?', placeholder: 'Abstraction layers, circuit breakers, fallbacks, monitoring…' },
    { type: 'Quick Take', text: 'What HTTP status codes should a DELETE endpoint return in different scenarios? What about a GET for a non-existent resource?', placeholder: '204, 200, 404, 410 — when to use each…' },
    { type: 'What Would You Do?', text: 'Design the authentication flow for a public API. How do you handle token rotation, revocation, and granular scopes?', placeholder: 'OAuth, API keys, JWTs, scopes, refresh tokens…' },
    { type: 'Spot the Risk', text: 'Your API response includes internal database IDs (integers like 1, 2, 3) as the primary identifier for resources. What could go wrong?', placeholder: 'Enumeration, security, coupling to implementation…' },
  ],
  databases: [
    { type: 'Quick Take', text: 'Explain what a database index is. What is the trade-off of adding more indexes to a table?', placeholder: 'Read vs write performance, storage, maintenance…' },
    { type: 'What Would You Do?', text: 'A query that used to run in 50ms is now taking 4 seconds after a table grew from 1 million to 50 million rows. Walk me through your diagnosis.', placeholder: 'EXPLAIN plan, indexes, query structure, cardinality…' },
    { type: 'Spot the Risk', text: 'A developer on your team wants to run a long-running data migration in a single transaction on a live production database. What do you flag?', placeholder: 'Lock contention, rollback size, table bloat…' },
    { type: 'Quick Take', text: 'What is ACID? Walk through each property with a practical example.', placeholder: 'Atomicity, consistency, isolation, durability…' },
    { type: 'What Would You Do?', text: 'You need to model a tagging system where any entity (posts, users, products) can have arbitrary tags. What schema would you choose and why?', placeholder: 'EAV, polymorphic joins, JSONB, tag tables…' },
    { type: 'Spot the Risk', text: 'Your application is using SELECT * everywhere in production queries. No one on the team sees this as a problem. What would you say?', placeholder: 'Bandwidth, index-only scans, schema coupling…' },
    { type: 'Quick Take', text: 'What is the N+1 query problem? Show a concrete example and how you would fix it.', placeholder: 'ORM patterns, eager loading, joins…' },
    { type: 'What Would You Do?', text: 'You need to store and query user activity events. The table is expected to grow by 10 million rows per day. How do you design the storage?', placeholder: 'Partitioning, archiving, time-series DBs, retention…' },
    { type: 'Spot the Risk', text: 'Two transactions are both trying to update account balances. Describe how a deadlock could occur and how you would prevent it.', placeholder: 'Lock ordering, isolation levels, retry logic…' },
    { type: 'Quick Take', text: 'When would you choose a document database (like MongoDB) over a relational database? What do you give up?', placeholder: 'Schema flexibility, transactions, joins, querying…' },
    { type: 'What Would You Do?', text: 'Your Postgres replica is lagging 30 seconds behind primary during peak traffic. Reads from the replica are becoming stale. How do you handle this?', placeholder: 'Read routing, lag thresholds, replication tuning…' },
    { type: 'Spot the Risk', text: 'A proposal to store all configuration data as a JSON blob in a single row in the database. What problems might arise at scale?', placeholder: 'Querying, indexing, contention, schema evolution…' },
  ],
  security: [
    { type: 'Spot the Risk', text: 'Review this code: `db.query("SELECT * FROM users WHERE email = \'" + email + "\'")`. What\'s the vulnerability and how do you fix it?', context: 'const email = req.body.email;\ndb.query("SELECT * FROM users WHERE email = \'" + email + "\'");', placeholder: 'Name the attack, show the fix, explain parameterization…' },
    { type: 'Quick Take', text: 'What is the difference between authentication and authorization? Give an example where you could get one right and still fail the other.', placeholder: 'Authn = who you are, authz = what you can do…' },
    { type: 'What Would You Do?', text: 'A user reports they can see another user\'s order history by changing the ID in the URL. How do you respond and what does the fix look like?', placeholder: 'IDOR, immediate steps, code fix, detection…' },
    { type: 'Spot the Risk', text: 'Your team stores JWT tokens in localStorage and uses them for API authentication. What security concerns would you raise?', placeholder: 'XSS, httpOnly cookies, token expiry, rotation…' },
    { type: 'Quick Take', text: 'What is a CSRF attack? How does the SameSite cookie attribute help, and when is it not enough?', placeholder: 'Explain the attack vector and defense layers…' },
    { type: 'What Would You Do?', text: 'You\'re designing a password reset flow. What security properties should it have, and what are common mistakes to avoid?', placeholder: 'Token expiry, single-use, side-channel leaks, enumeration…' },
    { type: 'Spot the Risk', text: 'Your API logs request bodies for debugging. A teammate notices user passwords appear in plaintext in your log aggregation system. What do you do?', placeholder: 'Immediate containment, scrubbing, audit, prevention…' },
    { type: 'Quick Take', text: 'What is the difference between symmetric and asymmetric encryption? When would you use each?', placeholder: 'Speed, key distribution, use cases like TLS, JWT…' },
    { type: 'What Would You Do?', text: 'You\'re building an API that will be called by third-party partners. How do you authenticate them and ensure they can only access their own data?', placeholder: 'API keys, OAuth, scopes, tenant isolation…' },
    { type: 'Spot the Risk', text: 'Your application renders user-supplied content in a React component using `dangerouslySetInnerHTML`. When is this dangerous and how do you mitigate it?', placeholder: 'XSS vectors, sanitization libraries, CSP headers…' },
    { type: 'Quick Take', text: 'What is the principle of least privilege? Give an example of how violating it led to a real-world security incident.', placeholder: 'Database permissions, IAM roles, blast radius…' },
    { type: 'What Would You Do?', text: 'You discover that an API endpoint that should require authentication is accessible without any token. It\'s been live for 6 months. Walk me through your response.', placeholder: 'Scope assessment, logging review, disclosure, patch…' },
  ],
  cloud: [
    { type: 'Quick Take', text: 'What is the difference between IaaS, PaaS, and SaaS? Give an example of each and when you would choose one over another.', placeholder: 'Control vs convenience trade-off…' },
    { type: 'What Would You Do?', text: 'Design the infrastructure for a web application that needs to handle 10x traffic spikes during a product launch, then scale back down to normal.', placeholder: 'Auto-scaling, load balancers, stateless design, cost…' },
    { type: 'Spot the Risk', text: 'Your team stores AWS credentials in a .env file that gets committed to a private GitHub repo. A contractor had access last month. What do you do?', placeholder: 'Rotation, audit, scope of access, prevention…' },
    { type: 'Quick Take', text: 'What is the difference between serverless functions and containers? What drives the choice between them?', placeholder: 'Cold starts, duration limits, cost model, state…' },
    { type: 'What Would You Do?', text: 'A pod in your Kubernetes cluster is crashlooping. Walk me through how you would diagnose and fix it.', placeholder: 'kubectl commands, logs, events, resource limits…' },
    { type: 'Spot the Risk', text: 'Your company runs everything in a single AWS availability zone to save on data transfer costs. What risks does this introduce?', placeholder: 'AZ failure, RTO/RPO, failover planning…' },
    { type: 'Quick Take', text: 'What is infrastructure as code? What problems does it solve compared to manually configuring resources?', placeholder: 'Repeatability, drift, code review, rollback…' },
    { type: 'What Would You Do?', text: 'You\'re migrating a monolithic application to microservices on Kubernetes. You have 3 months and a team of 5. How do you prioritize?', placeholder: 'Strangler fig, service boundaries, dependencies, risk…' },
    { type: 'Spot the Risk', text: 'A teammate proposes using spot/preemptible instances for your entire production workload because they\'re 80% cheaper. What do you say?', placeholder: 'Interruption handling, stateful workloads, mixing strategies…' },
    { type: 'Quick Take', text: 'What is a VPC and why does it matter for a production cloud deployment?', placeholder: 'Network isolation, subnets, security groups, NAT…' },
    { type: 'What Would You Do?', text: 'Your cloud bill tripled last month with no obvious explanation. Walk me through how you would investigate and reduce it.', placeholder: 'Cost explorer, unused resources, rightsizing, alerts…' },
    { type: 'Spot the Risk', text: 'A developer proposes deploying a new service directly to production to test it with real traffic. They say it\'s a small change. What do you think?', placeholder: 'Feature flags, canary deployments, blast radius…' },
  ],
  concurrency: [
    { type: 'Quick Take', text: 'What is a race condition? Give a concrete example in a web application context.', placeholder: 'Shared state, interleaved execution, real-world example…' },
    { type: 'Spot the Risk', text: 'Your checkout flow reads inventory, checks if stock > 0, then decrements it. What could go wrong under concurrent load?', context: 'const stock = await db.getStock(itemId);\nif (stock > 0) {\n  await db.decrementStock(itemId);\n  await createOrder(userId, itemId);\n}', placeholder: 'Describe the race condition and the fix…' },
    { type: 'Quick Take', text: 'What is a deadlock? Describe the four conditions required for one to occur.', placeholder: 'Mutual exclusion, hold-and-wait, no preemption, circular wait…' },
    { type: 'What Would You Do?', text: 'You need to run 1,000 external API calls as fast as possible, but the target API allows max 50 concurrent requests. How do you implement this?', placeholder: 'Semaphores, worker pools, rate limiting, backpressure…' },
    { type: 'Spot the Risk', text: 'Two background jobs both read a counter from the database, increment it in memory, and write it back. They run simultaneously. What happens?', placeholder: 'Lost update problem, atomic operations, locks…' },
    { type: 'Quick Take', text: 'What is the difference between concurrency and parallelism? Why can a single-core machine be concurrent but not parallel?', placeholder: 'Interleaving vs simultaneous execution, context switching…' },
    { type: 'What Would You Do?', text: 'A long-running background job is consuming too much CPU and starving other processes. How do you address this without stopping the job?', placeholder: 'Priority, yielding, chunking, scheduling strategies…' },
    { type: 'Spot the Risk', text: 'Your Node.js service is doing heavy JSON parsing on the main event loop for each request. Under load, response times spike to 5 seconds. Why?', placeholder: 'Event loop blocking, worker threads, streaming…' },
    { type: 'Quick Take', text: 'What is a mutex and what is a semaphore? When would you use one over the other?', placeholder: 'Mutual exclusion vs counting permits, use cases…' },
    { type: 'What Would You Do?', text: 'A user can trigger an expensive computation from the UI. The same user triggers it 3 times in quick succession. How do you handle the duplicate work?', placeholder: 'Debouncing, idempotency keys, job deduplication…' },
    { type: 'Spot the Risk', text: 'Your team uses a global variable to cache a config object that is occasionally refreshed in the background. Multiple goroutines/threads read it. What risk exists?', placeholder: 'Data races, atomic reads, copy-on-write, sync primitives…' },
    { type: 'Quick Take', text: 'What is the actor model of concurrency? How does it differ from shared-memory concurrency?', placeholder: 'Message passing, isolation, Akka/Erlang examples…' },
  ],
  'frontend-perf': [
    { type: 'Quick Take', text: 'What are Core Web Vitals? Name the three main metrics and what user experience each measures.', placeholder: 'LCP, CLS, INP — define and link to UX…' },
    { type: 'What Would You Do?', text: 'Your Largest Contentful Paint score is 4.2 seconds. The main culprit is a large hero image. Walk me through how you would fix it.', placeholder: 'Image sizing, formats, lazy loading, preload, CDN…' },
    { type: 'Spot the Risk', text: 'A teammate adds a 2MB JavaScript bundle to the homepage that only 5% of users actually need. They say it\'s fine because it\'s cached after the first visit. What do you say?', placeholder: 'First load cost, parse time, mobile devices, cache reality…' },
    { type: 'Quick Take', text: 'What is code splitting and how does it improve frontend performance?', placeholder: 'Lazy loading routes, dynamic imports, chunk strategy…' },
    { type: 'What Would You Do?', text: 'Your single-page application has 300ms of blank screen time before any content appears. How do you investigate and fix this?', placeholder: 'SSR, critical CSS, prerendering, resource hints…' },
    { type: 'Spot the Risk', text: 'A React component re-renders every 16ms because a parent passes a new object literal `{{ value: 1 }}` as a prop on every render. Why is this a problem?', placeholder: 'Reference equality, useMemo, shouldComponentUpdate…' },
    { type: 'Quick Take', text: 'What is the difference between `defer` and `async` on a script tag? When would you use each?', placeholder: 'Parsing behavior, execution timing, dependencies…' },
    { type: 'What Would You Do?', text: 'Your app has a data table that needs to display 50,000 rows. Users are reporting the browser freezes when they scroll. How do you fix this?', placeholder: 'Virtual scrolling, windowing, pagination trade-offs…' },
    { type: 'Spot the Risk', text: 'Your team uses a CSS framework that loads 500KB of styles, but your app only uses 10% of them. No one has touched this in two years. What do you do?', placeholder: 'PurgeCSS, tree-shaking, audit tools, migration path…' },
    { type: 'Quick Take', text: 'What is browser caching and how do cache-control headers work? What is the difference between max-age and s-maxage?', placeholder: 'TTL, CDN vs browser cache, immutable, ETag…' },
    { type: 'What Would You Do?', text: 'You notice a Cumulative Layout Shift (CLS) score of 0.35 on your product pages. Walk me through how you would find and eliminate the shifts.', placeholder: 'Image dimensions, font swaps, dynamic content, skeleton UI…' },
    { type: 'Spot the Risk', text: 'A teammate suggests loading all third-party analytics, chat, and A/B testing scripts in the document head synchronously. What impact will this have?', placeholder: 'Render blocking, TBT, TTFB, async alternatives…' },
  ],
}

const questions = computed<Question[]>(() => {
  const bank = questionBank[props.flow.id]
  return bank ?? questionBank['system-design']
})

const q = computed(() => questions.value[current.value])

function back() {
  if (current.value > 0) current.value--
}

function next() {
  if (current.value < totalQuestions - 1) {
    current.value++
    if (current.value > highWater.value) {
      highWater.value = current.value
      emit('questionAnswered', highWater.value)
    }
  } else {
    const finalCount = totalQuestions
    if (finalCount > highWater.value) {
      highWater.value = finalCount
      emit('questionAnswered', highWater.value)
    }
    emit('finish')
  }
}
</script>
