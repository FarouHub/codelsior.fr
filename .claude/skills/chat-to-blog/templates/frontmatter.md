---
# Adapter ces champs au schema Zod de TA content collection.
# Verifier src/content/config.ts (ou src/content.config.ts) avant d'ecrire.
title: "{{ TITLE }}"
description: "{{ DESCRIPTION }}"      # 1-2 phrases, utile au SEO
pubDate: {{ YYYY-MM-DD }}            # certains schemas attendent `date`
updatedDate: {{ YYYY-MM-DD }}        # optionnel
tags:                                # ou `categories` selon ton schema
  - "{{ TAG_1 }}"
  - "{{ TAG_2 }}"
heroImage: ""                        # optionnel
author: "Nicolas"
draft: true                          # TOUJOURS true a la generation
---
 
{{ INTRODUCTION }}
 
## {{ SECTION_1 }}
 
{{ CONTENU }}
 
## {{ SECTION_2 }}
 
{{ CONTENU }}
 
## Conclusion
 
{{ TAKEAWAYS }}
 