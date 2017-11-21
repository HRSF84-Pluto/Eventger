import React,{Component} from 'react';


const FilterOptions = (props)=> (
  <div>
    <label className="container"><p>One</p>
    <input type="checkbox" />
    <span className="checkmark"></span>
  </label>
  <label className="container"><p>Two</p>
    <input type="checkbox"/>
      <span className="checkmark"></span>
  </label>
  <label className="container"><p>Three</p>
    <input type="checkbox"/>
    <span className="checkmark"></span>
  </label>
  <label className="container"><p>Four</p>
    <input type="checkbox"/>
      <span className="checkmark"></span>
  </label>
  </div>

);


export default FilterOptions;
