# Introduction

Welcome to the official documentation for the **JungleTV Application Framework**!
Known as JungleTV AF for short, or even simply as JAF, it allows for the development and delivery of custom experiences within [JungleTV](https://jungletv.live), a media sharing and group media consumption website.

This page provides a broad introduction to the JungleTV AF and to how its documentation is organized.

## What is the JungleTV Application Framework?

The JungleTV AF is a set a components contained in the JungleTV server and client software, that allows the JungleTV service to be **extended** without the need to modify, deeply understand or otherwise "buy into" the code and technology stack that powers the core of JungleTV.
Each set of extensions is grouped as a logical unit called an "application."
Experiences powered by the JAF are meant to be made **available to the JungleTV community**, meaning they instantly get the attention of thousands of eyeballs in a short amount of time.
There is, therefore, the **expectation that these applications are to be reliable, secure and generally polished**.

To help developers realize their visions while meeting expectations, the JAF **abstracts the more complex aspects of building a web application** with which hundreds of users will interact, possibly simultaneously.
The result is a framework which uses a combination of some **familiar technologies**, like JavaScript and HTML, **specialized tecnology**, like [Goja](https://github.com/dop251/goja), and **purpose-built technology**, like the collection of libraries at the disposal of JAF applications.

One of the goals of the JungleTV AF is to allow developers, including those who didn't work on the JungleTV core, to **quickly iterate on new functionality** for the service, from features meant to be **used through time** and possibly even integrated in a more permanent fashion in the JungleTV core, to more **experimental and temporary** installations, perhaps designed around a one-off community event.
JAF applications can implement certain types of JungleTV features with less than 10% of the code necessary to achieve the same effects by modifying the core of the service.

The JungleTV AF encompasses a simple development environment accessed and contained within the backoffice UI of the JungleTV service.
Developers external to the team are meant to request access to a **staging instance** of the JungleTV service where they will have the necessary permissions to access this environment and develop new applications, which may be eventually promoted to the production environment, once reviewed by the JungleTV team.
Those feeling adventurous can also set up a private JungleTV instance on their own computers, so they will be able to develop JAF applications in a permissionless and private fashion, even offline if necessary.

The JungleTV AF is continuously in development and is currently in a **preview** stage, meaning it currently changes at a fast pace, and **long-term application compatibility is not guaranteed**.

## About the documentation

Like the JAF itself, this documentation is in flux, and is likely slightly out of date compared to the current state of the framework.
It is maintained alongside the [JungleTV source code](https://github.com/tnyim/jungletv/); all and any corrections and suggestions are appreciated and can be provided via GitHub issues and pull requests.

### Who is this documentation for?

This documentation is aimed at developers looking for **guidance on how to build a JungleTV AF application**, also containing a complete reference for the external interfaces (APIs) of JAF-specific libraries and components.
This documentation is **not specifically directed at developers looking to work on the JungleTV core**, for example to modify the Application Framework itself.
Those in the latter group should begin by taking a look at the [JungleTV source code](https://github.com/tnyim/jungletv/) and should get in contact with JungleTV core developers for further guidance.

### How is the documentation organized?

This documentation is both a practical guide and a reference guide, starting as the former and progressively evolving into the latter in the later sections.
While it may seem a bit counter-intuitive, because the JAF is still in development, the reference sections are likely more complete and up-to-date than the higher-level overviews and guides.

- The [Getting started](/getting-started/) section contains an overview of JungleTV AF concepts and will guide you through the development of a simple application.
- The [Manual](/manual/) section contains more detailed information about different aspects of the framework.
- The [Reference](/reference/) section contains an exhaustive (ideally) enumeration and explanation of every aspect of the interfaces exposed by the JungleTV AF, both to server-side components and to client-side components.