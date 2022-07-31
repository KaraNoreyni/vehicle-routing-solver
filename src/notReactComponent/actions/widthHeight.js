export function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);
  
    return Math.ceil(el.offsetHeight + margin);
}
export function getAbsoluteWidth(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginLeft']) +
                 parseFloat(styles['marginRight']);
    
    return Math.ceil(el.offsetWidth + margin);
}

