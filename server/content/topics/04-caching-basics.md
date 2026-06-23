---
title: Caching Basics
subtitle: Why the fastest request is the one you never make
category: Systems
readMinutes: 3
questions:
  - prompt: What is the core purpose of a cache?
    options:
      - To permanently store the source of truth
      - To keep a fast copy of data so you can avoid recomputing or refetching it
      - To encrypt data at rest
      - To back up the database
    answer: 1
    explanation: A cache trades a little memory and staleness risk for speed by keeping a fast-to-reach copy of expensive-to-produce data.
  - prompt: What is a "cache hit"?
    options:
      - The cache crashed
      - The requested data was found in the cache
      - The data was missing and had to be fetched from the source
      - The cache was cleared
    answer: 1
    explanation: A hit means the data was already in the cache and returned quickly. A miss means it wasn't there and had to be fetched from the origin.
  - prompt: Why is cache invalidation considered hard?
    options:
      - Caches cannot be deleted
      - Knowing exactly when cached data becomes stale and updating it correctly is subtle
      - It requires special hardware
      - Caches are write-only
    answer: 1
    explanation: Serving stale data or clearing too aggressively both cause bugs. Deciding when a cached value is no longer valid is genuinely tricky.
  - prompt: What does a TTL (time to live) on a cache entry do?
    options:
      - Encrypts the entry
      - Defines how long the entry stays valid before it is considered stale
      - Sets the maximum size of the cache
      - Pins the entry permanently
    answer: 1
    explanation: A TTL bounds staleness — after it expires, the entry is refreshed from the source. It's the simplest invalidation strategy.
  - prompt: A "cache stampede" happens when...
    options:
      - The cache server runs out of disk
      - Many requests miss at once and all hit the origin simultaneously
      - Two caches disagree
      - The TTL is set too high
    answer: 1
    explanation: When a popular entry expires, a flood of concurrent misses can hammer the origin at the same instant. Techniques like locking or staggered TTLs prevent it.
---

## The idea

Some data is **expensive** to produce — a slow database query, a call to another
service, a heavy computation. A **cache** keeps a fast copy of that result so the
next request can skip the expensive work. The fastest request is the one you
never have to make.

## Hits and misses

- **Cache hit** — the data was in the cache; return it instantly.
- **Cache miss** — it wasn't there; fetch from the source, then store it for next time.

Your **hit rate** (hits ÷ total lookups) is the headline metric. A high hit rate
means the cache is doing its job.

## Where caches live

Caching happens at many layers:

- **Browser** — caches images, scripts, API responses.
- **CDN** — caches content close to users geographically.
- **Application** — in-memory caches like Redis or Memcached.
- **Database** — query and page caches.

## The hard part: invalidation

> "There are only two hard things in computer science: cache invalidation and
> naming things."

A cache is a *copy*, and copies go **stale** when the source changes. You have to
decide when to refresh:

- **TTL (time to live)** — expire entries after N seconds. Simple, but you may
  serve slightly stale data.
- **Write-through / explicit invalidation** — update or clear the cache when the
  source changes. Fresher, but more code and more ways to get it wrong.

## A failure mode to know

A **cache stampede**: a hot entry expires and thousands of requests miss at the
same moment, all slamming the origin at once. Fixes include locking (only one
request refills), serving stale while refreshing, or jittering TTLs so entries
don't expire together.

## The one thing to remember

> Caching buys speed by keeping copies — and the whole game is deciding when those
> copies are allowed to be stale.
