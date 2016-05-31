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
    .match({ attrs: { class: /js-/g } }, node => {

        let customAttrs = {};

        node.attrs.class =
            node.attrs.class
                .split(' ')
                .reduce((prev, current) => {

                    if (current.startsWith('js-'))
                        customAttrs = {
                            'data-js': 'data-js' in customAttrs
                                ? [customAttrs['data-js'] || '', current.slice(0, 3)].join(' ').trim()
                                : current.substr(3)
                        }

                    if (!current.startsWith('js-'))
                        return [prev || '', current].join(' ').trim()

                }, null)

        if (Object.keys(customAttrs).length)
            node.attrs = Object.assign(node.attrs, customAttrs)

        return node;
    })
    .match({ attrs: { class: true } }, node => {

        node.attrs.class =
            node.attrs.class
                .split(' ')
                .reduce((prev, current) => {

                    if (!classes.includes(current))
                        return [prev || '', current].join(' ').trim()

                }, null)
        return node;
    })


posthtml([plugin])
    .process(html)
    .then(function (result) {
        console.log(result.html)
    })
    .catch(console.error)