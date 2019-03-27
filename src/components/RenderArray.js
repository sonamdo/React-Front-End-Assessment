import React from 'react';

class RenderArray extends React.Component {

  constructor(props) { //setting state to empty array which will be filled after get json call
    super(props);
    this.state = {
      studentArray: [],
      search: "",
      tagSearch: "",
    }
  }

  updateSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  updateTagSearch(e) {
    var tagMatch = false

    for(var i = 0; i<this.state.studentArray.length; i++){
        tagMatch = false
      for(var z = 0; z<this.state.studentArray[i].tags.length; z++){
        if((this.state.studentArray[i].tags[z]).includes(e.target.value)){
          tagMatch = true
          console.log(tagMatch)
        }
        let studentArray = [...this.state.studentArray];
        studentArray[i].showStudent = tagMatch;

        this.setState({
          studentArray
        })
      }
    }
    this.setState({
      tagSearch: e.target.value
    })
  }

  updateTag(i, e) {

    if(e.keyCode == 13){
      e.preventDefault()

      let studentArray = [...this.state.studentArray];
      studentArray[i-1].tags.push(e.target.value)

      this.setState({
        studentArray
      })

    }
  }

  handleToggleVisibility(id) {
    var target = document.getElementById(id)
    var targetButton = document.getElementById(id + 'button')

    if (target.style.display !== "block") {
      target.style.display = "block";
      targetButton.innerHTML = '-'
    }
    else {
      target.style.display = "none";
      targetButton.innerHTML= '+'
    }

  }

  componentDidMount() {
    fetch('https://www.hatchways.io/api/assessment/students')
      .then(response => response.json())
      .then(json => this.setState({
        studentArray : json.students.map(function(student){
          var o = Object.assign([],student);
          o.tags = ['test','testing','and'];
          o.showStudent = true;
          return o
        })
      }))
  }

  render(){

    const gradeReducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue)

    console.log(this.state)
    return(
      <div>
        <nav id = "searchBar" className = 'navbar navbar-default navbar-fixed-top'>
          <input
            type = "text"
            onChange = {this.updateSearch.bind(this)}
            placeholder = "Search by name"
          />
          <input
            type = "text"
            onChange = {this.updateTagSearch.bind(this)}
            placeholder = "Search by tags"
          />
        </nav>
      <div id = "secondContainer">
        {(this.state.studentArray)
          .filter(student => (student.firstName.toLowerCase()).includes(this.state.search.toLowerCase()))
          .filter(student => (student.showStudent))
          .map((student, i) =>
          <div key = {student.firstName} className = 'container studentContainer'>
            <div className = "row">
              <div className = "col-xl-2">
                  <img src = {student.pic} className = "pic"/>
              </div>
              <div className = "col-xl-9">
                <div>
                <h4><strong>{student.firstName + " " + student.lastName}</strong></h4>
                  <ul>
                    <li>Email: {student.email}</li>
                    <li>Company: {student.company}</li>
                    <li>Skill: {student.skill}</li>
                    <li>Average: {student.grades.reduce(gradeReducer)/8}%</li>
                    <div id = {i} className = "gradesDisplay">
                      <li>Test 1: {student.grades[0]}%</li>
                      <li>Test 2: {student.grades[1]}%</li>
                      <li>Test 3: {student.grades[2]}%</li>
                      <li>Test 4: {student.grades[3]}%</li>
                      <li>Test 5: {student.grades[4]}%</li>
                      <li>Test 6: {student.grades[5]}%</li>
                      <li>Test 7: {student.grades[6]}%</li>
                      <li>Test 8: {student.grades[7]}%</li>
                      <li>
                      {
                        (student.tags).map((tag) => <div className = "tag" key = {student.firstName + tag}>{tag}</div>)
                      }
                      </li>
                      <form>
                      <input
                        type = "text"
                        onKeyDown = {this.updateTag.bind(this, student.id)}
                        placeholder = "Add a tag"
                      />
                      </form>
                    </div>
                  </ul>
                 </div>
              </div>
              <div className = "col-xl-1">
                <button className = "hideButton" id = {i+'button'} onClick = { ()=> {this.handleToggleVisibility(i)}}>+</button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    )
  };

}
export default RenderArray;
