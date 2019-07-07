# Overview

mylang is is very simple language written in node.js.

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

  ; last evaluated expression is returned
  result
}
```

NOTE that once a name is set with a value, it can't be changed.

## Control flow
The `if expression` can be used for code branching.

```
let zero-if-negative-otherwise-add-one [n] {
  if (> n 0) {
    0
  } elsif false {
    (println "wont ever get here")
  } else {
    (+ n 1)
  }
}
```

There are no loops. Recursion can be used:
```
let fib [n] {
  if (= n 0) {
    0
  } elsif (= n 1) {
    1
  } else {
    (+ (fib (- n 1)) (fib (- n 2)))
  }
}
```

## Functions
A named function can be defined with the let statement:
`let my-function [first second third] (+ first second third)`

The function's arguments are passed inside the brackets `[]`.
In a function, the last evaluated expression is returned.

An anonymous function can be created and passed:
```
let apply [f x] (f x)

(apply [z] (+ z 1) 1) ; will increase x by 1
```

Functions with a various number of arguments can be created using the varargs argument:
```
; sum all accept 2 or more arguments
let sum-all [a b @rest] {
  (+ a b @rest) ; here is passes the rest of the arguments to the + function
}
```

NOTE that is can only be the last function argument.

Functions can also assign expressions as default parameter value:
```
let with-default[n = 4] {
  n ; will return 4 if called without parameters, and otherwise will return the parameter passed
}
```

NOTE no parameter without a default value can come after a parameter with default value.
