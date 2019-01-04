# mylang

A programming language I wrote for educational purposes.

Its a very simple, dynamic language which relies heavily on functions and immutable data structures.

## Data Types:
- int
- float
- string
- boolean
- nil
- functions
- set
- list
- dict (map)

## Defining values
In order to define a value (give it a name), use the `let statement`:
```
let x 1 ; x now holds the value of 1, and can't be changed
let y true

let sum [a b] (+ a b)
let sum-and-print [a b] {
  let result (+ a b)
  (println result)

  return result
}
```

NOTE that once a name is set with a value, it can't be changed.

## Control flow
The `if statement` can be used for code branching.

```
let zero-if-negative-otherwise-add-one [n] {
  if (> n 0) {
    return 0
  } elsif false {
    (println "wont ever get here")
  } else {
    retun (+ n 1)
  }
}
```

There are no loops. Recursion can be used:
```
let fib [n] {
  if (= n 0) {
    return 0
  } elsif (= n 1) {
    return 1
  } else {
    return (+ (fib (- n 1)) (fib (- n 2)))
  }
}
```

## Functions
A named function can be defined with the let statement:
`let my-function [first second third] (+ first second third)`

The function's arguments are passed inside the brackets `[]`.

An anonymous function can be passed, for example using the `return statement`:
```
let apply [f x] (f x)

(apply [z] (+ z 1) 1) ; will increase x by 1
```

Functions with a various number of arguments can be created using the varargs argument:
```
; sum all accept 2 or more arguments
let sum-all [a b @rest] {
  return (+ a b @rest) ; here is passes the rest of the arguments to the + function
}
```

NOTE that is can only be the last function argument.
