Raphael-paragraph
=================

A plugin for Raphael.js that allows you to create paragraphs of text with word wrapping and vertical line spacing.


What is this for?
-----------------

If you've worked much with SVG or Raphael.js, you'll know that multi-line text can be a real pain. That's because SVG doesn't natively support automatic line breaking (although the VML format supported by legacy IE does, maddeningly enough). As such, the only way to render a paragraph in Raphael.js is to manually insert line breaks. This is annoying at best, or impossible at worst (e.g. because an SVG element might have a dynamic width).