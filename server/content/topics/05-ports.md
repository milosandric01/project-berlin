---
title: Ports
subtitle: Getting data to the right application
category: Networking
readMinutes: 3
questions:
  - prompt: What problem do ports solve?
    options:
      - Getting data to the correct machine on the network
      - Getting data to the correct application on a machine
      - Encrypting data in transit
      - Converting domain names to IP addresses
    answer: 1
    explanation: The IP address routes data to the right machine. The port number identifies which application or service on that machine should receive the data.
  - prompt: Which port is commonly used for HTTPS?
    options:
      - 22
      - 80
      - 443
      - 5432
    answer: 2
    explanation: Port 443 is the standard port for HTTPS traffic. Port 80 is HTTP, 22 is SSH, and 5432 is PostgreSQL.
  - prompt: Where is the port number stored in a network packet?
    options:
      - In the IP header
      - In the TCP or UDP header
      - In the Ethernet frame
      - In the application data
    answer: 1
    explanation: Port numbers belong to the transport layer (TCP/UDP), not the network layer (IP). They are stored in the TCP or UDP header inside the IP payload.
  - prompt: "What does the notation 192.168.1.10:443 mean?"
    options:
      - IP address 192.168.1.10, subnet mask 443
      - IP address 192.168.1.10, port 443
      - IP address 192.168.1, port 10443
      - MAC address followed by a version number
    answer: 1
    explanation: "The colon separates the IP address from the port number. 192.168.1.10:443 means connect to machine 192.168.1.10 on port 443 (HTTPS)."
  - prompt: Why can one machine run a web server and an SSH server at the same time?
    options:
      - They use different IP addresses
      - They listen on different ports
      - They use different MAC addresses
      - Only one can run at a time
    answer: 1
    explanation: Multiple services share one IP address but listen on different port numbers (e.g. 80/443 for web, 22 for SSH), so incoming data reaches the correct service.
---

When your computer sends data to another machine over the network, it needs to specify more than just the IP address.

The IP address gets the data to the right machine.

But a machine can run many things at the same time:

- Browser
- Email app
- Database
- Web server
- SSH server

So when data reaches that machine, it needs another number to know which application or service should receive it.

That number is the **port**.

---

## Ports are like doors

Imagine a building.

The building has one street address.

But it can have many doors.

- Front door
- Back door
- Delivery door
- Employee door

Your computer works in a similar way.

The IP address gets data to the building.

The port tells it which door to use.

> *IP address = building address
> Port       = door*

For example:

*192.168.1.10:443*

---

## Common ports

Some ports are commonly used for specific services:

- 80   → HTTP
- 443  → HTTPS
- 22   → SSH
- 5432 → PostgreSQL
- 3306 → MySQL

When you open a website using HTTPS, your browser usually connects to port `443`.

When you SSH into a server, you usually connect to port `22`.

Same machine.

Different doors.

Different services.

---

## Where do ports live?

Ports are not part of the IP address itself.

Ports belong to **TCP** or **UDP**.

That means the port number is not stored in the IP header.

It is stored in the TCP or UDP header.

A simplified **IP packet** looks like this:

```
IP packet
├── IP header
│   ├── Source IP
│   └── Destination IP
│
└── IP payload
    ├── TCP/UDP header
    │   ├── Source port
    │   └── Destination port
    │
    └── Application data
```

So IP gets data to the right machine.

The port gets data to the right application.
