const _form = date => ("00" + date).slice(-2)

exports._date = () => {
    const d = new Date();
    return `${d.getFullYear()}-${_form(d.getMonth()+1)}-${_form(d.getDate())} ${_form(d.getHours())}:${_form(d.getMinutes())}:${_form(d.getSeconds())}`
}

exports.wrapE = f => {
    return (req, res, next) => {
        f(req, res, next).catch(next)
    }
}