import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Person = (props) => {
  const handleClick = () => {
    console.log('click')
    if (window.confirm(`Poistetaanko ${props.name}?`)) {
      personsService
        .annihilate(props.id)
        .then(() => { props.setPersons(props.persons.filter(person => person.id !== props.id)) })
      props.setPersonModified(`Poistettiin ${props.name} puhelinluettelosta`)
      setTimeout(() => {
        props.setPersonModified(null)
      }, 3000);
    }

  }
  return (
    <li>{props.name} {props.number}<button onClick={() => handleClick()}>poista</button></li>
  )
}

const Filter = (props) => {
  return (
    <div>
      rajaa näytettäviä
        <input
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  )

}

const Persons = (props) => {
  const names = () => personsToShow.map(person =>
    <Person
      key={person.name}
      name={person.name}
      number={person.number}
      id={person.id}
      persons={props.persons}
      setPersons={props.setPersons}
      setPersonModified={props.setPersonModified}
    />)
  const personsToShow = props.showAll
    ? props.persons
    : props.persons.filter(person => person.name.toUpperCase().includes(props.showPersons.toUpperCase()))

  return (
    <div>
      <ul>
        {names()}
      </ul>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addNumber}>
        <div>
          nimi: <input
            value={props.newName}
            onChange={props.handleNameChange}
          />
        </div>
        <div>
          numero: <input
            value={props.newNumber}
            onChange={props.handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">lisää</button>
        </div>
      </form>
    </div>
  )
}

const Notification = (props) => {
  if (props.message === null) {
    return null
  }
  return (
    <div className='notification'>
      {props.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showPersons, setShowPersons] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [personModified, setPersonModified] = useState(null)


  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addNumber = (event) => {
    event.preventDefault()
    const searchName = persons.map(person => person.name)
    if (!searchName.includes(newName)) {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })

      setPersonModified(`Lisättiin ${personObject.name} puhelinluetteloon`)
      setTimeout(() => {
        setPersonModified(null)
      }, 3000);
    } else {
      window.alert(`${newName} on jo luettelossa`)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleWantedChange = (event) => {
    console.log(event.target.value)
    const searched = event.target.value
    if (searched.length > 0) {
      setShowAll(false)
    }
    setShowPersons(event.target.value)
  }

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={personModified} />
      <Filter
        value={showPersons}
        onChange={handleWantedChange}
      />
      <h3>lisää uusi</h3>
      <PersonForm
        addNumber={addNumber}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numerot</h2>
      <Persons
        persons={persons}
        showAll={showAll}
        showPersons={showPersons}
        setPersons={setPersons}
        setPersonModified={setPersonModified}
      />
    </div>
  )

}

export default App
