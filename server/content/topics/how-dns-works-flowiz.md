# How DNS Works

How a domain name becomes an IP address

**Networking · Beginner · 3 min**

## What you’ll learn

You’ll learn how DNS translates a domain name into an IP address and how a DNS resolver follows the DNS hierarchy to find the final answer.

---

You type:

_google.com_

But your browser cannot connect to _google.com_ directly.

It first needs to find the server IP address behind that name, something like:

_142.250.xxx.xxx_

DNS is the system that translates the domain name into that IP address so you can send requests to it.

But here is the important part:

**DNS is not one giant database.** It is a layered structure where each layer says:

_“I do not know the final answer,  
but I know who you should ask next.”_

That process is called DNS Lookup. Let’s walk through it.

* * *

## Step 1: Your computer checks its cache

Before asking the internet, your computer checks whether it already knows the answer.

If you visited _google.com_ recently, the IP address may already be cached.

If the answer is cached, the lookup stops here.

No external DNS request is needed.

* * *

## Step 2: Your computer asks a DNS resolver

If the answer is not cached, your computer asks a DNS resolver (specialized server).

This resolver is usually run by:

*   Your ISP

*   Google DNS: `8.8.8.8`

*   Cloudflare DNS: `1.1.1.1`

The resolver’s job is to find the answer for you.

Your computer asks:

_“What is the IP address for google.com?”_

From here, the resolver does the recursive searching.

Your browser usually does not ask every DNS server directly.

The resolver does that work on your behalf.

* * *

## Step 3: The resolver asks the Root DNS servers

The resolver starts at the top of the DNS layered hierarchy: **the Root DNS servers**.

It asks:

_“What is the IP address for google.com?”_

The Root servers do not know Google’s IP address.

They only know where the **.com** servers are. Those servers where **.com, .org, etc.** live are called Top-Level Domain servers.

So root DNS servers reply to resolver:

_“Here are .com TLD name servers, ask them”_

* * *

## Step 4: The resolver asks the .com TLD servers

Next, the resolver asks the **.com** Top-Level Domain servers:

_“What is the IP address for google.com?”_

The **.com** servers usually do not know Google’s IP address either.

But they know which name servers are responsible for _google.com_.

They reply:

_“Here are google.com name servers, ask them_”

* * *

## Step 5: The resolver asks the authoritative DNS server

Now the resolver asks Google’s authoritative (final) DNS server:

_“What is the IP address for google.com?”_

This server holds the official DNS records for _google.com_.

It responds with the IP address:

_google.com → 142.250.xxx.xxx_

The resolver sends that answer back to your computer.

Your browser can now connect to the website.
