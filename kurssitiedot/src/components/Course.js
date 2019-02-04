import React from 'react'

const Header = (props) =>
    <h1>{props.name}</h1>

const Part = (props) =>
    <p>{props.name} {props.exercises}</p>

const Content = (props) => {
    const parts = () => props.course.parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />)

    const allExercises = props.course.parts.map(part =>
        part.exercises)

    const total = allExercises.reduce((all, current) => {
        return all + current;
    }, 0)

    return (
        <div>
            <Header name={props.course.name}/>
            {parts()}
            <p>Yhteensä {total} tehtävää</p>
        </div>
    )
}



const Course = ({ courses }) => {
    const coursesContent = () => courses.map(course =>
        <Content key={course.id} course={course} />)
    return (
        <div>
            {coursesContent()}
        </div>
    )

}

export default Course
