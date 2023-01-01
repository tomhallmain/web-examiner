
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

function fade(element, interval) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1){
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, interval);
}

function unfade(element, interval, saveDisplay) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
      element.style.display = saveDisplay;
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op += op * 0.1;
  }, interval);
}

function slowFlash(element, delay, interval) {
  setTimeout(function () {
    const saveDisplay = element.style.display;
    fade(element, interval);
    unfade(element, interval, saveDisplay);
  }, delay);
}

function highlight(selectors) {
  selectors.forEach( (selector, index) => {
    // Flash the selector elements one by one
    slowFlash(selector, 300*index, 100);
    // Set selector element properties to something noticeable
    selector.style.borderColor = 'red';
    selector.style.backgroundColor = 'paleGreen'
  });

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
  selectors = [].slice.call(document.querySelectorAll("*")).filter( function(el) {
    return [].slice.call(el.attributes).some(checkDataTest)
  });

  highlight(selectors);
}

function revealDataSelectors() {
  // Filter all page elements by their attributes
  selectors = [].slice.call(document.querySelectorAll("*")).filter( function(el) {
    return [].slice.call(el.attributes).some(checkData)
  });

  highlight(selectors);
}
