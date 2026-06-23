---
title: TCP vs UDP
subtitle: Reliability versus speed
category: Networking
readMinutes: 3
questions:
  - prompt: Which guarantee does TCP provide that UDP does not?
    options:
      - Faster delivery with no overhead
      - Reliable, in-order delivery of bytes
      - Encryption of the payload
      - Lower latency for every packet
    answer: 1
    explanation: TCP guarantees that bytes arrive reliably and in order, retransmitting anything lost. UDP makes no such promise.
  - prompt: Why is UDP often chosen for live video or gaming?
    options:
      - It encrypts data automatically
      - It guarantees every packet arrives
      - A slightly late packet is useless, so it is better to drop it and move on
      - It uses TCP under the hood
    answer: 2
    explanation: For real-time media, retransmitting a lost packet would arrive too late to matter. UDP's "send and forget" model keeps latency low.
  - prompt: What is the TCP three-way handshake for?
    options:
      - Encrypting the connection
      - Establishing a connection and initial sequence numbers before data flows
      - Compressing the payload
      - Resolving the domain name
    answer: 1
    explanation: SYN, SYN-ACK, ACK establishes a connection and synchronizes sequence numbers so both sides can track ordered, reliable delivery.
  - prompt: Which statement about UDP is true?
    options:
      - It establishes a connection before sending
      - It is connectionless and has no built-in retransmission
      - It guarantees ordering
      - It is always slower than TCP
    answer: 1
    explanation: UDP is connectionless — it just sends datagrams. There's no handshake, ordering, or retransmission unless the application adds it.
  - prompt: You're building a banking transaction API. Which transport is the safer default?
    options:
      - UDP, for speed
      - TCP, for reliable, ordered delivery
      - Neither, use raw IP
      - It does not matter
    answer: 1
    explanation: Financial data must not be silently lost or reordered, so TCP's reliability guarantees are the right default.
---

## Two ways to send data

Both **TCP** and **UDP** sit on top of IP and move data between machines. They
make opposite trade-offs, and knowing which to reach for is a core networking
instinct.

## TCP: reliable and ordered

TCP is a **connection-oriented** protocol. Before any data flows, the two sides
perform a **three-way handshake** (SYN → SYN-ACK → ACK) to agree they're both
ready and to sync sequence numbers.

After that, TCP guarantees:

- **Reliability** — lost packets are detected and retransmitted.
- **Ordering** — bytes arrive in the order they were sent.
- **Flow & congestion control** — it slows down to avoid overwhelming the network.

The cost is **overhead and latency**: handshakes, acknowledgements, and
retransmissions all take time.

## UDP: fast and connectionless

UDP just sends **datagrams** — no handshake, no acknowledgements, no ordering. If
a packet is lost, UDP doesn't care; it's gone. That sounds bad until you realize
it's exactly what some applications want.

UDP gives you:

- **Low latency** — no setup, no waiting for retransmissions.
- **Less overhead** — smaller headers, no connection state.
- **Application control** — you decide what reliability (if any) you need.

## When to use which

- **TCP**: web pages, APIs, file transfers, databases — anywhere correctness
  matters more than a few milliseconds.
- **UDP**: live video/voice, gaming, DNS lookups, telemetry — anywhere a late
  packet is worthless and speed wins.

## The one thing to remember

> TCP trades speed for guarantees; UDP trades guarantees for speed. Pick based on
> whether a lost or late packet actually hurts.
