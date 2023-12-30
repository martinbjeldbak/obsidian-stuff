## Books lookup using Google Books API

This script is a macro for the excelling
[QuickAdd] plugin.

Heavily inspired by `movies.js` from
[this][movie-macro]
guide, where the setup experience is identical except for script referenced,
and lack of API key requirement.

Below is my book template that I use

```md
---
subtitle: "{VALUE:subtitle}"
publisher: "{{VALUE:publisher}}"
poster: "{{VALUE:poster}}"
googleBooksId: "{{VALUE:id}}"
authors: {{VALUE:authorLinks}}
pages: "{{VALUE:pageCount}}"
genre: {{VALUE:categoryLinks}}
language: {{VALUE:language}}
year: "{{VALUE:year}}" 
created-at: "{{DATE:gggg-MM-DD}}"
tags:
  - books
rating: 
date-started:
date:
---

My notes
```

Heaps more `VALUE` fields can be used in the template - check some sample
responses from the official Google Books API documentation
[here][google-books-api-docs], especially the query parameter documentation.
This script will make a `VALUE` variable for each `volumeInfo` attribute.

[QuickAdd]: https://github.com/chhoumann/quickadd
[movie-macro]: https://quickadd.obsidian.guide/docs/Examples/Macro_MovieAndSeriesScript
[google-books-api-docs]: https://developers.google.com/books/docs/v1/getting_started 
