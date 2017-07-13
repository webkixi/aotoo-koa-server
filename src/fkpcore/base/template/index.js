function index(fkp, raw, data={}, type) {
  if (raw) {
    const tempSet = {
      1: {
        evaluate:    /{{([\s\S]+?)}}/g,
        interpolate: /{{=([\s\S]+?)}}/g,
        escape:      /{{-([\s\S]+?)}}/g
      },

      2: {
        evaluate:    /{{{([\s\S]+?)}}}/g,
        interpolate: /{{{=([\s\S]+?)}}}/g,
        escape:      /{{{-([\s\S]+?)}}}/g
      }
    }

    if (typeof type == 'number') {
      _.templateSettings = tempSet[type]
    }

    const compiled = _.template(raw)
    return compiled(data)
  }
}

export default function(fkp){
  return index
}
