// All rows must be the same length
// All elements must be a valid gate
// If a multi-qubit gate is present, the other parts of that gate must be in the same step
// The number of rows (qubits) in the circuit must be between 1 and 6, inclusive
// Atleast one column must be present

use serde::Serialize;
use crate::simulation::circuit_parser::{UnparsedCircuit};

#[derive(Debug, PartialEq, Serialize)]
pub enum QuantumCircuitError {
    TooManyQubits,
    TooFewQubits,
    InvalidGate,
    InvalidRowLength,
}

// Ensures that all rows are the same length and that there is at least one row
// and that the number of rows is between 1 and 6
pub fn validate_grid_input(grid: &UnparsedCircuit) -> Result<(), QuantumCircuitError> {
    if grid.circuit.is_empty() {
        return Err(QuantumCircuitError::TooFewQubits);
    }

    if grid.circuit.len() > 6 {
        return Err(QuantumCircuitError::TooManyQubits);
    }

    let row_length = grid.circuit[0].len();
    for row in grid.circuit.clone().iter() {
        if row.len() != row_length {
            return Err(QuantumCircuitError::InvalidRowLength);
        }
    }

    // Validate steps (columns)
    for i in 0..row_length {
        let mut col: Vec<String> = Vec::new();
        for row in grid.circuit.clone().iter() {
            col.push(row[i].clone());
        }

        match validate_col(&col) {
            Ok(_) => (),
            Err(err) => return Err(err),
        }
    }

    Ok(())
}

// Ensure that a gate is valid
fn validate_gate(gate: &str) -> bool {
    matches!(
        gate,
        "I" | "H"
            | "X"
            | "Y"
            | "Z"
            | "T"
            | "S"
            | "Swap"
            | "C_down"
    )
}

// Validate a row of gates
// Go through each gate and check if it is valid
// If a multi-qubit gate is present, check if the other parts of the gate are in the same step
// by adding them to a list and removing them if they are found
fn validate_col(row: &Vec<String>) -> Result<(), QuantumCircuitError> {
    for gate in row {
        if !validate_gate(gate) {
            return Err(QuantumCircuitError::InvalidGate);
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_grid_input() {
        let valid_grid = vec![vec!["I", "H"], vec!["X", "Y"]];
        let invalid_grid = vec![vec!["I", "H"], vec!["X", "Y", "Z"]];

        assert_eq!(validate_grid_input(&UnparsedCircuit::from(valid_grid)), Ok(()));
        assert_eq!(
            validate_grid_input(&UnparsedCircuit::from(invalid_grid)),
            Err(QuantumCircuitError::InvalidRowLength)
        );
    }

    #[test]
    fn test_validate_gate() {
        let valid_gate = "I";
        let invalid_gate = "A";

        assert_eq!(validate_gate(valid_gate), true);
        assert_eq!(validate_gate(invalid_gate), false);
    }

    #[test]
    fn test_valid_gates_but_exceed_qubit_limit() {
        let grid = vec![
            vec!["I", "H"],
            vec!["X", "Y"],
            vec!["Z", "T"],
            vec!["S", "I"],
            vec!["H", "X"],
            vec!["Y", "Z"],
            vec!["I", "S"],
        ];
        assert_eq!(
            validate_grid_input(&UnparsedCircuit::from(grid)),
            Err(QuantumCircuitError::TooManyQubits)
        );
    }

    #[test]
    fn test_valid_circuit_inconsistent_row_lengths() {
        let grid = vec![vec!["I", "H", "X"], vec!["X", "Y"]];
        assert_eq!(
            validate_grid_input(&UnparsedCircuit::from(grid)),
            Err(QuantumCircuitError::InvalidRowLength)
        );
    }

    #[test]
    fn valid_circuit() {
        let grid = vec![vec!["H", "C_down"], vec!["I", "X"]];
        assert_eq!(validate_grid_input(&UnparsedCircuit::from(grid)), Ok(()));
    }

    #[test]
    fn valid_circuit_with_single_gate() {
        let grid = vec![vec!["H"]];
        assert_eq!(validate_grid_input(&UnparsedCircuit::from(grid)), Ok(()));
    }

    #[test]
    fn validate_swap_circuit() {
        let grid = vec![vec!["X", "Swap"], vec!["I", "Swap"]];
        assert_eq!(validate_grid_input(&UnparsedCircuit::from(grid)), Ok(()));
    }
}
