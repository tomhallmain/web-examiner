
// General Methods

function revealSelectors(exactMatches, filters) {
  if (exactMatches) {
    var tag = filters['tag'] || '*';
    var selectors = DOMSearchExact(tag, filters) } 
  else {
    var selectors = DOMSearchRegex(filters) }

  highlight(selectors);
  return selectors;
}

function highlight(selectors) {
  selectors.forEach( (selector, index) => {
    // Flash the selector elements one by one
    $(this).delay(300*index).fadeIn(100).fadeOut(100).fadeIn(100)
    // Set selector element properties to something noticeable
    selector.style.borderColor = 'red';
    selector.style.backgroundColor = 'paleGreen' })

  selectors[0]?.scrollIntoView()
}

function DOMSearchExact(tag, filters) {
  let selectors = [];
  var filterSet = false

  Object.keys(filters).forEach( filter => {
    if (filter != 'tag' && filters[filter] != null && filters[filter] != undefined) {
      filterSet = true
      this[filter] = filters[filter] }
    else this[filter] = null })

  if (filterSet) {
    for (let elm of document.querySelectorAll(tag)) {
      if (
        classVal === elm.className
        || idVal === elm.id
        || textVal?.toLowerCase() === elm.textContent?.toLowerCase()
        || ((attrName || attrVal) ? testAttrsExact(elm, attrName, attrVal) : null)
      ) { selectors.push(elm) }}}
  else selectors = selectors.slice.call(document.querySelectorAll(tag));

  return selectors;
}

function DOMSearchRegex(filters) {
  Object.keys(filters).forEach( filter => {
    this[filter+'Re'] = filters[filter] ? new RegExp(filters[filter], 'i') : null })

  let selectors = [];
  for (let elm of document.querySelectorAll("*")) {
    if (
      tagRe?.test(elm.tagName.toLowerCase())
      || classValRe?.test(elm.className)
      || idValRe?.test(elm.id)
      || textValRe?.test(elm.textContent)
      || ((attrNameRe || attrValRe) ? testAttrsRegex(elm, attrNameRe, attrValRe) : null)
    ) { selectors.push(elm) }}

  return selectors;
}

function testAttrsExact(elm, attrName, attrVal) {
  if (!attrName && ! attrVal)
    return false;

  for (let attr of elm.attributes) {
    if (attrName === attr.name || attrVal === attr.value)
      { return true }}

  return false;
}

function testAttrsRegex(elm, attrNameRe, attrValRe) {
  if (!attrNameRe && ! attrValRe)
    return false;

  for (let attr of elm.attributes) {
    if (attrNameRe?.test(attr.name) || attrValRe?.test(attr.value))
      { return true }}

  return false;
}


// Custom Methods

function checkDataTest(attr) {
  return attr.name.indexOf('data-test-') === 0;
}

function checkData(attr) {
  return attr.name.indexOf('data-') === 0;
}

function revealDataTestSelectors() {
  // Filter all page elements by their attributes
  selectors = $("*").filter( function() {
    return $.makeArray(this.attributes).some(checkDataTest) })

  highlightJquery(selectors)
}

function revealDataSelectors() {
  // Filter all page elements by their attributes
  selectors = $("*").filter( function() {
    return $.makeArray(this.attributes).some(checkData) })

  highlightJquery(selectors)
}

function highlightJquery(selectors) {
  // Flash the selector elements one by one
  selectors.each( (selector, index) => {
    $(this).delay(300*index).fadeIn(100).fadeOut(100).fadeIn(100) })

  // Set selector element properties to something noticeable
  selectors.css({'border-color': 'red', 'background-color': 'paleGreen'})
  selectors[0]?.scrollIntoView()
}


