---
title: "DNS in 3 Minutes: What Happens When You Type google.com?"
subtitle: How a domain name becomes an IP address through a layered lookup
category: Networking
readMinutes: 3
questions:
  - prompt: Why can't your browser connect to google.com directly?
    options:
      - It needs to find the server's IP address first
      - The browser doesn't support domain names
      - Google blocks direct connections
      - DNS is required for encryption
    answer: 0
    explanation: Browsers need an IP address (like 142.250.xxx.xxx) to open a connection. DNS translates the human-readable domain name into that IP.
  - prompt: What is the DNS resolver's role in the lookup process?
    options:
      - It stores all IP addresses permanently
      - It does the recursive searching on your behalf, following the chain until it gets the final answer
      - It encrypts your DNS queries
      - It assigns domain names to websites
    answer: 1
    explanation: Your computer asks the resolver one question. The resolver then follows the DNS hierarchy (root → TLD → authoritative) until it gets the answer.
  - prompt: What do the Root DNS servers respond with when asked for google.com's IP?
    options:
      - The IP address of google.com
      - "Here are the .com TLD name servers, ask them"
      - An error message
      - The IP address of the DNS resolver
    answer: 1
    explanation: Root servers don't know individual domain IPs. They only know where the top-level domain servers (.com, .org, etc.) are and point you there.
  - prompt: Which server in the chain actually holds the official DNS records for google.com?
    options:
      - The Root DNS server
      - The .com TLD server
      - The authoritative DNS server for google.com
      - Your ISP's DNS resolver
    answer: 2
    explanation: The authoritative DNS server is the final stop — it holds the official records for the domain and responds with the actual IP address.
  - prompt: If you visited google.com recently, what happens when you type it again?
    options:
      - The full DNS lookup repeats every time
      - Your computer checks its cache first and may skip the external lookup entirely
      - The browser contacts the root servers directly
      - A new IP address is generated
    answer: 1
    explanation: Before asking the internet, your computer checks whether it already knows the answer from a recent visit. If cached, no external DNS request is needed.
---

You type:

**google.com**

But your browser cannot connect to google.com directly.

It first needs to find the server IP address behind that name, something like:

`142.250.xxx.xxx`

DNS is the system that translates the domain name into that IP address so you can send requests to it.

But here is the important part:

**DNS is not one giant database.** It is a layered structure where each layer says:

> "I do not know the final answer, but I know who you should ask next."

That process is called **DNS Lookup**. Let's walk through it.

## Step 1: Your computer checks its cache

Before asking the internet, your computer checks whether it already knows the answer.

If you visited google.com recently, the IP address may already be cached.

If the answer is cached, the lookup stops here. No external DNS request is needed.

## Step 2: Your computer asks a DNS resolver

If the answer is not cached, your computer asks a **DNS resolver** (a specialized server).

This resolver is usually run by:

- Your ISP
- Google DNS: `8.8.8.8`
- Cloudflare DNS: `1.1.1.1`

The resolver's job is to find the answer for you.

Your computer asks: *"What is the IP address for google.com?"*

From here, the resolver does the recursive searching. Your browser usually does not ask every DNS server directly. The resolver does that work on your behalf.

## Step 3: The resolver asks the Root DNS servers

The resolver starts at the top of the DNS layered hierarchy: the **Root DNS servers**.

It asks: *"What is the IP address for google.com?"*

The Root servers do not know Google's IP address. They only know where the `.com` servers are. Those servers where .com, .org, etc. live are called **Top-Level Domain servers**.

So root DNS servers reply to resolver: *"Here are .com TLD name servers, ask them"*

## Step 4: The resolver asks the .com TLD servers

Next, the resolver asks the .com **Top-Level Domain** servers:

*"What is the IP address for google.com?"*

The .com servers usually do not know Google's IP address either. But they know which name servers are responsible for google.com.

They reply: *"Here are google.com name servers, ask them"*

## Step 5: The resolver asks the authoritative DNS server

Now the resolver asks Google's **authoritative** (final) DNS server:

*"What is the IP address for google.com?"*

This server holds the official DNS records for google.com.

It responds with the IP address:

`google.com → 142.250.xxx.xxx`

The resolver sends that answer back to your computer. Your browser can now connect to the website.

## The full lookup path

```
Browser
↓
Computer cache
↓
DNS resolver
↓
Root DNS servers
↓
.com TLD servers
↓
Authoritative DNS servers
↓
IP address
```

One important detail:

**The DNS resolver is the one doing most of the work.**

Your computer asks the resolver one question. The resolver follows the chain until it gets the final answer.
