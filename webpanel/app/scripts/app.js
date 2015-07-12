(function(document, io, fetch) {
  'use strict';

  // image data using base64 encode, due to lack of designer
  var canImageUrl = {
    empty: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iMzQiIHdpZHRoPSIzNCIgeT0iLTEiIHg9Ii0xIi8+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGcgaWQ9InRyYXNoIj4KICAgPHBhdGggaWQ9InN2Z18xIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yOS45OCw2LjgxOWMtMC4wOTU5OTksLTEuNTcgLTEuMzg3MDAxLC0yLjgxNiAtMi45OCwtMi44MTZsLTMsMGwwLC0xbDAsLTAuMDAyYzAsLTEuNjU3IC0xLjM0NCwtMyAtMywtM2wtMTAsMGMtMS42NTcsMCAtMywxLjM0MyAtMywzbDAsMC4wMDFsMCwxbC0zLDBjLTEuNTk1LDAgLTIuODg1LDEuMjQ2IC0yLjk4MSwyLjgxNmwtMC4wMTksMGwwLDEuMTgzMDAxbDAsMWMwLDEuMTAzOTk5IDAuODk2LDIgMiwybDAsMGwwLDE2Ljk5OTk5OWMwLDIuMjA5IDEuNzkxLDQgNCw0bDE2LDBjMi4yMDksMCA0LC0xLjc5MSA0LC00bDAsLTE2Ljk5OTk5OWwwLDBjMS4xMDQsMCAyLC0wLjg5NjAwMSAyLC0ybDAsLTFsMCwtMS4xODJsLTAuMDIsMHptLTE5Ljk4LC0zLjgxN2MwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDEwLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDFsLTEyLDBsMCwtMXptMTYsMjUuMDAwMDAxYzAsMS4xMDE5OTkgLTAuODk4MDAxLDIgLTIsMmwtMTYsMGMtMS4xMDMsMCAtMiwtMC44OTgwMDEgLTIsLTJsMCwtMTdsMjAsMGwwLDE3em0yLC0yMC4wMDFsMCwxbC0yNCwwbDAsLTFsMCwtMC45OTkwMDFjMCwtMC41NTMgMC40NDcsLTEgMSwtMWwyMiwwYzAuNTUyOTk5LDAgMSwwLjQ0NyAxLDFsMCwwLjk5OTAwMXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTksMjguMDA2MDAxbDIsMGMwLjU1MywwIDEsLTAuNDQ2OTk5IDEsLTFsMCwtMTIuOTk5OTk5YzAsLTAuNTUzMDAxIC0wLjQ0NywtMSAtMSwtMWwtMiwwYy0wLjU1MywwIC0xLDAuNDQ3IC0xLDFsMCwxMi45OTk5OTljMCwwLjU1Mjk5OSAwLjQ0NywxIDEsMXptMCwtMTQuMDAxbDIsMGwwLDEyLjk5OTk5OWwtMiwwbDAsLTEyLjk5OTk5OXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTE1LDI4LjAwNjAwMWwyLDBjMC41NTI5OTksMCAxLC0wLjQ0Njk5OSAxLC0xbDAsLTEyLjk5OTk5OWMwLC0wLjU1MzAwMSAtMC40NDcwMDEsLTEgLTEsLTFsLTIsMGMtMC41NTMsMCAtMSwwLjQ0NyAtMSwxbDAsMTIuOTk5OTk5YzAsMC41NTI5OTkgMC40NDcsMSAxLDF6bTAsLTE0LjAwMWwyLDBsMCwxMi45OTk5OTlsLTIsMGwwLC0xMi45OTk5OTl6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICAgPHBhdGggaWQ9InN2Z180IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yMSwyOC4wMDYwMDFsMiwwYzAuNTUyOTk5LDAgMSwtMC40NDY5OTkgMSwtMWwwLC0xMi45OTk5OTljMCwtMC41NTMwMDEgLTAuNDQ3MDAxLC0xIC0xLC0xbC0yLDBjLTAuNTUyOTk5LDAgLTEsMC40NDcgLTEsMWwwLDEyLjk5OTk5OWMwLDAuNTUyOTk5IDAuNDQ3MDAxLDEgMSwxem0wLC0xNC4wMDFsMiwwbDAsMTIuOTk5OTk5bC0yLDBsMCwtMTIuOTk5OTk5eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=',
    veryLow: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0idHJhc2giPgogICA8cmVjdCBpZD0ic3ZnXzEiIGZpbGw9IiM0Q0FGNTAiIGhlaWdodD0iNSIgd2lkdGg9IjIwIiB5PSIyNSIgeD0iNiIvPgogICA8cGF0aCBpZD0ic3ZnXzIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTI5Ljk4LDYuODE5Yy0wLjA5NTk5OSwtMS41NyAtMS4zODcwMDEsLTIuODE2IC0yLjk4LC0yLjgxNmwtMywwbDAsLTFsMCwtMC4wMDJjMCwtMS42NTcgLTEuMzQ0LC0zIC0zLC0zbC0xMCwwYy0xLjY1NywwIC0zLDEuMzQzIC0zLDNsMCwwLjAwMWwwLDFsLTMsMGMtMS41OTUsMCAtMi44ODUsMS4yNDYgLTIuOTgxLDIuODE2bC0wLjAxOSwwbDAsMS4xODMwMDFsMCwxYzAsMS4xMDM5OTkgMC44OTYsMiAyLDJsMCwwbDAsMTYuOTk5OTk5YzAsMi4yMDkgMS43OTEsNCA0LDRsMTYsMGMyLjIwOSwwIDQsLTEuNzkxIDQsLTRsMCwtMTYuOTk5OTk5bDAsMGMxLjEwNCwwIDIsLTAuODk2MDAxIDIsLTJsMCwtMWwwLC0xLjE4MmwtMC4wMiwwem0tMTkuOTgsLTMuODE3YzAsLTAuNTUzIDAuNDQ3LC0xIDEsLTFsMTAsMGMwLjU1Mjk5OSwwIDEsMC40NDcgMSwxbDAsMWwtMTIsMGwwLC0xem0xNiwyNS4wMDAwMDFjMCwxLjEwMTk5OSAtMC44OTgwMDEsMiAtMiwybC0xNiwwYy0xLjEwMywwIC0yLC0wLjg5ODAwMSAtMiwtMmwwLC0xN2wyMCwwbDAsMTd6bTIsLTIwLjAwMWwwLDFsLTI0LDBsMCwtMWwwLC0wLjk5OTAwMWMwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDIyLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDAuOTk5MDAxeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgIDxwYXRoIGlkPSJzdmdfMyIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMzMzMzMzIiBkPSJtOSwyOC4wMDYwMDFsMiwwYzAuNTUzLDAgMSwtMC40NDY5OTkgMSwtMWwwLC0xMi45OTk5OTljMCwtMC41NTMwMDEgLTAuNDQ3LC0xIC0xLC0xbC0yLDBjLTAuNTUzLDAgLTEsMC40NDcgLTEsMWwwLDEyLjk5OTk5OWMwLDAuNTUyOTk5IDAuNDQ3LDEgMSwxem0wLC0xNC4wMDFsMiwwbDAsMTIuOTk5OTk5bC0yLDBsMCwtMTIuOTk5OTk5eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgIDxwYXRoIGlkPSJzdmdfNCIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMzMzMzMzIiBkPSJtMTUsMjguMDA2MDAxbDIsMGMwLjU1Mjk5OSwwIDEsLTAuNDQ2OTk5IDEsLTFsMCwtMTIuOTk5OTk5YzAsLTAuNTUzMDAxIC0wLjQ0NzAwMSwtMSAtMSwtMWwtMiwwYy0wLjU1MywwIC0xLDAuNDQ3IC0xLDFsMCwxMi45OTk5OTljMCwwLjU1Mjk5OSAwLjQ0NywxIDEsMXptMCwtMTQuMDAxbDIsMGwwLDEyLjk5OTk5OWwtMiwwbDAsLTEyLjk5OTk5OXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTIxLDI4LjAwNjAwMWwyLDBjMC41NTI5OTksMCAxLC0wLjQ0Njk5OSAxLC0xbDAsLTEyLjk5OTk5OWMwLC0wLjU1MzAwMSAtMC40NDcwMDEsLTEgLTEsLTFsLTIsMGMtMC41NTI5OTksMCAtMSwwLjQ0NyAtMSwxbDAsMTIuOTk5OTk5YzAsMC41NTI5OTkgMC40NDcwMDEsMSAxLDF6bTAsLTE0LjAwMWwyLDBsMCwxMi45OTk5OTlsLTIsMGwwLC0xMi45OTk5OTl6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPg==',
    low: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0idHJhc2giPgogICA8cmVjdCBpZD0ic3ZnXzEiIGZpbGw9IiNGRkVCM0IiIGhlaWdodD0iMTAiIHdpZHRoPSIyMCIgeT0iMjAiIHg9IjYiLz4KICAgPHBhdGggaWQ9InN2Z18yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yOS45OCw2LjgxOWMtMC4wOTU5OTksLTEuNTcgLTEuMzg3MDAxLC0yLjgxNiAtMi45OCwtMi44MTZsLTMsMGwwLC0xbDAsLTAuMDAyYzAsLTEuNjU3IC0xLjM0NCwtMyAtMywtM2wtMTAsMGMtMS42NTcsMCAtMywxLjM0MyAtMywzbDAsMC4wMDFsMCwxbC0zLDBjLTEuNTk1LDAgLTIuODg1LDEuMjQ2IC0yLjk4MSwyLjgxNmwtMC4wMTksMGwwLDEuMTgzMDAxbDAsMWMwLDEuMTAzOTk5IDAuODk2LDIgMiwybDAsMGwwLDE2Ljk5OTk5OWMwLDIuMjA5IDEuNzkxLDQgNCw0bDE2LDBjMi4yMDksMCA0LC0xLjc5MSA0LC00bDAsLTE2Ljk5OTk5OWwwLDBjMS4xMDQsMCAyLC0wLjg5NjAwMSAyLC0ybDAsLTFsMCwtMS4xODJsLTAuMDIsMHptLTE5Ljk4LC0zLjgxN2MwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDEwLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDFsLTEyLDBsMCwtMXptMTYsMjUuMDAwMDAxYzAsMS4xMDE5OTkgLTAuODk4MDAxLDIgLTIsMmwtMTYsMGMtMS4xMDMsMCAtMiwtMC44OTgwMDEgLTIsLTJsMCwtMTdsMjAsMGwwLDE3em0yLC0yMC4wMDFsMCwxbC0yNCwwbDAsLTFsMCwtMC45OTkwMDFjMCwtMC41NTMgMC40NDcsLTEgMSwtMWwyMiwwYzAuNTUyOTk5LDAgMSwwLjQ0NyAxLDFsMCwwLjk5OTAwMXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTksMjguMDA2MDAxbDIsMGMwLjU1MywwIDEsLTAuNDQ2OTk5IDEsLTFsMCwtMTIuOTk5OTk5YzAsLTAuNTUzMDAxIC0wLjQ0NywtMSAtMSwtMWwtMiwwYy0wLjU1MywwIC0xLDAuNDQ3IC0xLDFsMCwxMi45OTk5OTljMCwwLjU1Mjk5OSAwLjQ0NywxIDEsMXptMCwtMTQuMDAxbDIsMGwwLDEyLjk5OTk5OWwtMiwwbDAsLTEyLjk5OTk5OXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTE1LDI4LjAwNjAwMWwyLDBjMC41NTI5OTksMCAxLC0wLjQ0Njk5OSAxLC0xbDAsLTEyLjk5OTk5OWMwLC0wLjU1MzAwMSAtMC40NDcwMDEsLTEgLTEsLTFsLTIsMGMtMC41NTMsMCAtMSwwLjQ0NyAtMSwxbDAsMTIuOTk5OTk5YzAsMC41NTI5OTkgMC40NDcsMSAxLDF6bTAsLTE0LjAwMWwyLDBsMCwxMi45OTk5OTlsLTIsMGwwLC0xMi45OTk5OTl6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICAgPHBhdGggaWQ9InN2Z181IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yMSwyOC4wMDYwMDFsMiwwYzAuNTUyOTk5LDAgMSwtMC40NDY5OTkgMSwtMWwwLC0xMi45OTk5OTljMCwtMC41NTMwMDEgLTAuNDQ3MDAxLC0xIC0xLC0xbC0yLDBjLTAuNTUyOTk5LDAgLTEsMC40NDcgLTEsMWwwLDEyLjk5OTk5OWMwLDAuNTUyOTk5IDAuNDQ3MDAxLDEgMSwxem0wLC0xNC4wMDFsMiwwbDAsMTIuOTk5OTk5bC0yLDBsMCwtMTIuOTk5OTk5eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=',
    middle: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0idHJhc2giPgogICA8cmVjdCBpZD0ic3ZnXzEiIGZpbGw9IiNGRkMxMDciIGhlaWdodD0iMTUiIHdpZHRoPSIyMCIgeT0iMTUiIHg9IjYiLz4KICAgPHBhdGggaWQ9InN2Z18yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yOS45OCw2LjgxOWMtMC4wOTU5OTksLTEuNTcgLTEuMzg3MDAxLC0yLjgxNiAtMi45OCwtMi44MTZsLTMsMGwwLC0xbDAsLTAuMDAyYzAsLTEuNjU3IC0xLjM0NCwtMyAtMywtM2wtMTAsMGMtMS42NTcsMCAtMywxLjM0MyAtMywzbDAsMC4wMDFsMCwxbC0zLDBjLTEuNTk1LDAgLTIuODg1LDEuMjQ2IC0yLjk4MSwyLjgxNmwtMC4wMTksMGwwLDEuMTgzMDAxbDAsMWMwLDEuMTAzOTk5IDAuODk2LDIgMiwybDAsMGwwLDE2Ljk5OTk5OWMwLDIuMjA5IDEuNzkxLDQgNCw0bDE2LDBjMi4yMDksMCA0LC0xLjc5MSA0LC00bDAsLTE2Ljk5OTk5OWwwLDBjMS4xMDQsMCAyLC0wLjg5NjAwMSAyLC0ybDAsLTFsMCwtMS4xODJsLTAuMDIsMHptLTE5Ljk4LC0zLjgxN2MwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDEwLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDFsLTEyLDBsMCwtMXptMTYsMjUuMDAwMDAxYzAsMS4xMDE5OTkgLTAuODk4MDAxLDIgLTIsMmwtMTYsMGMtMS4xMDMsMCAtMiwtMC44OTgwMDEgLTIsLTJsMCwtMTdsMjAsMGwwLDE3em0yLC0yMC4wMDFsMCwxbC0yNCwwbDAsLTFsMCwtMC45OTkwMDFjMCwtMC41NTMgMC40NDcsLTEgMSwtMWwyMiwwYzAuNTUyOTk5LDAgMSwwLjQ0NyAxLDFsMCwwLjk5OTAwMXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTksMjguMDA2MDAxbDIsMGMwLjU1MywwIDEsLTAuNDQ2OTk5IDEsLTFsMCwtMTIuOTk5OTk5YzAsLTAuNTUzMDAxIC0wLjQ0NywtMSAtMSwtMWwtMiwwYy0wLjU1MywwIC0xLDAuNDQ3IC0xLDFsMCwxMi45OTk5OTljMCwwLjU1Mjk5OSAwLjQ0NywxIDEsMXptMCwtMTQuMDAxbDIsMGwwLDEyLjk5OTk5OWwtMiwwbDAsLTEyLjk5OTk5OXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTE1LDI4LjAwNjAwMWwyLDBjMC41NTI5OTksMCAxLC0wLjQ0Njk5OSAxLC0xbDAsLTEyLjk5OTk5OWMwLC0wLjU1MzAwMSAtMC40NDcwMDEsLTEgLTEsLTFsLTIsMGMtMC41NTMsMCAtMSwwLjQ0NyAtMSwxbDAsMTIuOTk5OTk5YzAsMC41NTI5OTkgMC40NDcsMSAxLDF6bTAsLTE0LjAwMWwyLDBsMCwxMi45OTk5OTlsLTIsMGwwLC0xMi45OTk5OTl6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICAgPHBhdGggaWQ9InN2Z181IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yMSwyOC4wMDYwMDFsMiwwYzAuNTUyOTk5LDAgMSwtMC40NDY5OTkgMSwtMWwwLC0xMi45OTk5OTljMCwtMC41NTMwMDEgLTAuNDQ3MDAxLC0xIC0xLC0xbC0yLDBjLTAuNTUyOTk5LDAgLTEsMC40NDcgLTEsMWwwLDEyLjk5OTk5OWMwLDAuNTUyOTk5IDAuNDQ3MDAxLDEgMSwxem0wLC0xNC4wMDFsMiwwbDAsMTIuOTk5OTk5bC0yLDBsMCwtMTIuOTk5OTk5eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=',
    high: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKIDxnPgogIDx0aXRsZT5iYWNrZ3JvdW5kPC90aXRsZT4KICA8cmVjdCBmaWxsPSJub25lIiBpZD0iY2FudmFzX2JhY2tncm91bmQiIGhlaWdodD0iNDAyIiB3aWR0aD0iNTgyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0idHJhc2giPgogICA8cmVjdCBpZD0ic3ZnXzEiIGZpbGw9IiNGNDQzMzYiIGhlaWdodD0iMTkiIHdpZHRoPSIyMCIgeT0iMTEiIHg9IjYiLz4KICAgPHBhdGggaWQ9InN2Z18yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzMzMzMiIGQ9Im0yOS45OCw2LjgxOWMtMC4wOTU5OTksLTEuNTcgLTEuMzg2OTk5LC0yLjgxNiAtMi45OCwtMi44MTZsLTMsMGwwLC0xbDAsLTAuMDAyYzAsLTEuNjU3IC0xLjM0NCwtMyAtMywtM2wtMTAsMGMtMS42NTcsMCAtMywxLjM0MyAtMywzbDAsMC4wMDFsMCwxbC0zLDBjLTEuNTk1LDAgLTIuODg1LDEuMjQ2IC0yLjk4MSwyLjgxNmwtMC4wMTksMGwwLDEuMTgzMDAxbDAsMWMwLDEuMTAzOTk5IDAuODk2LDIgMiwybDAsMGwwLDE2Ljk5OTk5OWMwLDIuMjA5IDEuNzkxLDQgNCw0bDE2LDBjMi4yMDksMCA0LC0xLjc5MSA0LC00bDAsLTE2Ljk5OTk5OWwwLDBjMS4xMDQsMCAyLC0wLjg5NjAwMSAyLC0ybDAsLTFsMCwtMS4xODJsLTAuMDIsMHptLTE5Ljk4LC0zLjgxN2MwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDEwLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDFsLTEyLDBsMCwtMXptMTYsMjUuMDAwMDAxYzAsMS4xMDE5OTkgLTAuODk4MDAxLDIgLTIsMmwtMTYsMGMtMS4xMDMsMCAtMiwtMC44OTgwMDEgLTIsLTJsMCwtMTcuMDAwMDAxbDIwLDBsMCwxNy4wMDAwMDF6bTIsLTIwLjAwMWwwLDFsLTI0LDBsMCwtMWwwLC0wLjk5OTAwMWMwLC0wLjU1MyAwLjQ0NywtMSAxLC0xbDIyLDBjMC41NTI5OTksMCAxLDAuNDQ3IDEsMWwwLDAuOTk5MDAxeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgIDxwYXRoIGlkPSJzdmdfMyIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMzMzMzMzIiBkPSJtOSwyOC4wMDYwMDFsMiwwYzAuNTUzLDAgMSwtMC40NDcwMDEgMSwtMWwwLC0xMy4wMDAwMDFjMCwtMC41NTI5OTkgLTAuNDQ3LC0xIC0xLC0xbC0yLDBjLTAuNTUzLDAgLTEsMC40NDcwMDEgLTEsMWwwLDEzLjAwMDAwMWMwLDAuNTUyOTk5IDAuNDQ3LDEgMSwxem0wLC0xNC4wMDFsMiwwbDAsMTIuOTk5OTk5bC0yLDBsMCwtMTIuOTk5OTk5eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgIDxwYXRoIGlkPSJzdmdfNCIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMzMzMzMzIiBkPSJtMTUsMjguMDA2MDAxbDIsMGMwLjU1Mjk5OSwwIDEsLTAuNDQ3MDAxIDEsLTFsMCwtMTMuMDAwMDAxYzAsLTAuNTUyOTk5IC0wLjQ0NzAwMSwtMSAtMSwtMWwtMiwwYy0wLjU1MywwIC0xLDAuNDQ3MDAxIC0xLDFsMCwxMy4wMDAwMDFjMCwwLjU1Mjk5OSAwLjQ0NywxIDEsMXptMCwtMTQuMDAxbDIsMGwwLDEyLjk5OTk5OWwtMiwwbDAsLTEyLjk5OTk5OXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICA8cGF0aCBpZD0ic3ZnXzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzMzMzMzMyIgZD0ibTIxLDI4LjAwNjAwMWwyLDBjMC41NTI5OTksMCAxLC0wLjQ0NzAwMSAxLC0xbDAsLTEzLjAwMDAwMWMwLC0wLjU1Mjk5OSAtMC40NDcwMDEsLTEgLTEsLTFsLTIsMGMtMC41NTI5OTksMCAtMSwwLjQ0NzAwMSAtMSwxbDAsMTMuMDAwMDAxYzAsMC41NTI5OTkgMC40NDcwMDEsMSAxLDF6bTAsLTE0LjAwMWwyLDBsMCwxMi45OTk5OTlsLTIsMGwwLC0xMi45OTk5OTl6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPg=='
  };

  var tilted = false;
  var eventLogs = [];
  var currentWeather = {};

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    var cityMap = document.getElementById('city-map');
    cityMap.styles =[
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },{
        "featureType": "landscape",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "color": "#80d380" }
        ]
      },{
      }
    ];

    cityMap.addEventListener('api-load', function(e) {
      // hack to hard code direction
      document.querySelectorAll('google-map-directions')[0].map = this.map;
      document.querySelectorAll('google-map-directions')[1].map = this.map;
    });

    var trashCan1 = document.getElementById('trash-can-1')
      .icon = canImageUrl.high;
    var trashCan2 = document.getElementById('trash-can-2')
      .icon = canImageUrl.middle;
    var trashCan3 = document.getElementById('trash-can-3')
      .icon = canImageUrl.low;
    var trashCan4 = document.getElementById('trash-can-4')
      .icon = canImageUrl.veryLow;
    var trashCan5 = document.getElementById('trash-can-5')
      .icon = canImageUrl.empty;
    var trashCan6 = document.getElementById('trash-can-6')
      .icon = canImageUrl.high;
    var trashCan7 = document.getElementById('trash-can-7')
      .icon = canImageUrl.high;
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  function getRandomValue(offset, factor) {
    return offset + Math.round(factor * Math.random());
  }

  function getFillLevelColor (level) {
    if (level > 15) {
      return '#F44336';
    } else if (level > 10) {
      return '#FFC107';
    } else if (level > 5) {
      return '#FFEB3B';
    } else {
      return '#4CAF50';
    }
  }

  function setTemperature (temperature) {
    var gauge = document.getElementById('mutating_gauge');
    gauge.data = [["Label", "Value"],["Temperature", temperature]];
  }

  function setTilted () {
    var trashCan = document.querySelector('.trash-can');
    trashCan.classList.add('tilted');
    tilted = true;
  }

  function setUntilted () {
    var trashCan = document.querySelector('.trash-can');
    trashCan.classList.remove('tilted');
    tilted = false;
  }

  function setTrashLevel (level) {
    var fillLevel = document.getElementById('fill-level');
    var upperBound = 30;

    level = Math.round((level / upperBound) * 20);

    if (tilted) {
      fillLevel.setAttribute('y', 11);
      fillLevel.setAttribute('height', 19);
      fillLevel.setAttribute('x', 26-level);
      fillLevel.setAttribute('width', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    } else {
      fillLevel.setAttribute('x', 6);
      fillLevel.setAttribute('width', 20);
      fillLevel.setAttribute('y', 30-level);
      fillLevel.setAttribute('height', level);
      fillLevel.setAttribute('fill', getFillLevelColor(level));
    }
  }

  function appendEvent (event) {
    var eventTable = document.getElementById('event-table');
    // unshift to push to beginning
    eventLogs.unshift(event);

    eventTable.data = eventLogs;

    // hack to get table redraw
    eventTable.refreshPagination(true);
  }

  function getCurrentWeather (lat, lon) {
    fetch('http://api.openweathermap.org/data/2.5/weather' +
        '?lat=' + lat +
        '&lon='+ lon
      )
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        // data format:
        // {
        //  main: {
        //    temp: number, (in Kelvin unit)
        //    pressure: number,
        //    humidity: number
        //  },
        //  weather: [
        //    {
        //      description: String
        //    }
        //  ]
        // }
        currentWeather = data;
        document.querySelector('.temp-1')
          .textContent = ((data.main.temp - 273.15) * 1.8 + 32).toFixed(2);
        document.querySelector('.humidity-1')
          .textContent = data.main.humidity.toFixed(2);
        document.querySelector('.description-1')
          .textContent = data.weather[0].description;
      });
  }

  getCurrentWeather(34.0183573, -118.489185);

  // connectToBoard('10.60.0.88', '1337');

  function connectToBoard (ip, port) {
    var socket = io.connect('http://' + ip + ':' + port);

    // Attach a 'connected' event handler to the socket
    socket.on("connected", function (message) {
        // Sanity check
        console.log(message);
    });

    // message JSON String format
    // {
    //  lat: number,
    //  long: number,
    //  tilted: boolean,
    //  temperature: number (in Fer),
    //  distance: number (in CM)
    // }
    socket.on("message", function (message) {
      var allEvent = JSON.parse(message);
      if (allEvent.tilted === true) {
        setTilted();
      } else {
        setUntilted();
      }

      setTrashLevel(allEvent.distance);
      setTemperature(Math.round(allEvent.temperature));

      appendEvent({
        Timestamp: new Date(),
        'Trash Level': allEvent.distance,
        Temperature: allEvent.temperature,
        Tilted: allEvent.tilted ? 'Yes': 'No',
        Longitude: allEvent.long,
        Latitude: allEvent.lat
      });
    });
  }

})(document, io, fetch);
