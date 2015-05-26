# Raphael-paragraph

A plugin for Raphael.js that allows you to create paragraphs of multiline text with automatic word wrapping and vertical line spacing. The paragraphs are "real" Raphael element sets, and can be animated, stacked and evented like any others. Lengthy words are hyphenated and impossible-to-fit words are truncated with ellipses.


## Why would I need this?

Raphael.js provides a `paper.text()` method, but this only creates single-line text. You can insert line breaks manually, but a text element won't wrap automatically, and you don't have much control over the vertical spacing of the text lines. Ultimately this is because SVG does not provide a paragraph element, even though VML does, and the Raphael.js team have always insisted that they'll only expose features common to both technologies.

## Examples

Simple usage:

```
// Create a canvas
var paper = Raphael("myPaper", 640, 480);
// Set our text
var longText = "The quick brown fox jumps over the lazy dog";
// Draw it in a text-wrapped paragraph
paper.paragraph({x : 0, y : 0, maxWidth : 100, text : longText,);
```

With text styling:

```
paper.paragraph({
	x : 0,
	y : 0, 
	maxWidth : 100, 
	text : longText, 
	textStyle : {"font-family" : "Helvetica", "font-weight" : "bold", "font-size" : 16, "text-anchor" : "center"} 
});
```

See the reference for a much more detailed rundown of the options you can pass.


## Reference


### Adding raphael-paragraph to your project

This is simple - just take `dist/raphael-paragraph.js`, add it to your project and load the file after Raphael.js is loaded. If you don't load the files in the right order, raphael-paragraph.js will throw a friendly exception you'll be able to see in your browser's console. It'll also throw a warning if you add raphael-paragraph.js multiple times.

The distributable doesn't add anything to the global namespace - it just adds a `paragraph` method to `raphael.paper`.

Minified and gzipped, Raphael-Paragraph is around a 2kb payload.


### Options

`paper.paragraph` takes a single argument - an object of options. All options have a default value, if you don't provide them.


#### options.text

Sets the paragraph's text. Note that duplicate spaces will be ignored, and line breaks handled like ordinary spaces.

**Type:** String

**Default value:** "Hello, world!"


#### options.x

The x-position of the upper left coordinate of the paragraph box.

**Type:** Number

**Default value:** 0 (left side of canvas)


#### options.y

The y-position the upper left coordinate of the paragraph box.

**Type:** Number

**Default value:** 0 (top of canvas)


#### options.maxWidth

Set the width of the paragraph - the maximum width of a line before the text wraps.

**Type:** Number

**Default value:** paper.width - options.x. In other words: defaults the right edge of the paragraph to the right edge of the canvas.


#### options.maxHeight

Set the maximum height of the paragraph - if specified, sets a vertical cutoff point at which text is truncated.

**Type:** Number, Infinity

**Default value:** paper.height - options.y. In other words: defaults the cutoff to the bottom of the canvas.


#### options.lineHeight

Set the pixel gap between lines of text. This may be negative if you want an overlapping effect.

**Type:** Number

**Default value:** pixel size of text


#### options.textStyle

Object specifying the styles of the text. Style fields are themselves optional. Text style options are documented at http://raphaeljs.com/reference.html#Element.attr

Fields include _font_, _font-family_, _font-weight_, _opacity_, _stroke_, _stroke-width_, _text-anchor_ (for alignment) and _title_ (for link tooltips). For example, if I want bold, size 16 text, aligned to the center, I might pass the styles `{"font-weight" : "bold", "font-size" : 16, "text-anchor" : "middle"}`.

**Type:** Object of Raphael element attribute values

**Default value:** {'font-size' : 13, 'text-anchor' : 'start'}


#### options.hyphenationEnabled

Turns text hyphenation on or off. You might want to disable this if you're rendering a lot of text, as hyphenation can be a performance killer.

**Type:** Boolean

**Default value:** True


### Return value

Raphael-paragraph will return a `paper.set` of the elements that make up each line of the generated paragraph. This is a true Raphael set and supports the full range of Raphael element methods. For example:

```
// Get the paragraph
var paragraph = paper.paragraph(paragraphOptions);

// Rotate the paragraph
paragraph.transform(someTransformationString);

// Animate the paragraph
paragraph.animate(animationConfig);

// Add a drop shadow to the paragraph
paragraph.glow({offsetx : 3, offsety : 3});

// Add a hover event to the paragraph
paragraph.hover(hoverInFunction, hoverOutFunction);
```

Raphael-paragraph will not normally throw any exceptions - so if it does, raise a bug.