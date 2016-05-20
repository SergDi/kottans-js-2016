'use strict'
const posthtml = require('posthtml');

let classes = ['form-group', 'form-control', 'col-lg-4'];

let html = `
    	<div class="form-group js-sqq js-saas" >
            <label class="col-lg-4 control-label">source connection</label>
            <div class="col-lg-5">
                <select class="form-control">
					<option value="number:38891" label="some connection" selected="selected">some connection</option>
				</select>
                <span class="has-error">
                    <span class="help-block js-smth">Please select source connection.</span>
                </span>
            </div>
            <div class="col-lg-3">
                <button class="btn btn-default">
				<i class="glyphicon-plus glyphicon"></i> New</button>
            </div>
        </div>
    `;

const plugin = tree => tree
    .match({ attrs: { class: true } }, node => {

        let customAttrs = {};

        node.attrs.class =
            node.attrs.class
                .split(' ')
                .reduce((prev, current) => {

                    if (current.substr(0, 3) === 'js-')
                        customAttrs = {
                            'data-js': customAttrs['data-js'] !== undefined
                                ? customAttrs['data-js'] + ' ' + current.substr(3)
                                : current.substr(3)
                        }


                    if (!(classes.some(s => s === current) || current.substr(0, 3) === 'js-'))
                        return prev === null
                            ? current
                            : prev + ' ' + current
                    else
                        return prev

                }, null)


        if (customAttrs)
            node.attrs = Object.assign(node.attrs, customAttrs)

        return node;
    })


posthtml([plugin])
    .process(html)
    .then(function (result) {
        console.log(result.html)
    })
    .catch(console.error)