import React from 'react'
import Polyglot from 'node-polyglot'

var polyglot = new Polyglot({phrases: {'hello': 'This is a translation of "hello"'}});

polyglot.extend({
  "hello": "This is a translation of 'hello'"
});


export default () => (
  <div>
    <h1>{polyglot.t("hello")}</h1>
  </div>
)
