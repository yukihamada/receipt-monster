use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    clock::Clock,
    sysvar::Sysvar,
};
use thiserror::Error;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TimestampRecord {
    pub file_hash: String,
    pub timestamp: i64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ProgramState {
    pub admin: Pubkey,
    pub record_count: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TimestampInstruction {
    Initialize { admin: Pubkey },
    AddTimestamp { file_hash: String },
    GetTimestamp { file_hash: String },
}

#[derive(Error, Debug)]
pub enum TimestampError {
    #[error("Invalid instruction data")]
    InvalidInstructionData,
    #[error("Not authorized")]
    NotAuthorized,
    #[error("Record not found")]
    RecordNotFound,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = TimestampInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        TimestampInstruction::Initialize { admin } => {
            initialize(program_id, accounts, admin)
        }
        TimestampInstruction::AddTimestamp { file_hash } => {
            add_timestamp(program_id, accounts, file_hash)
        }
        TimestampInstruction::GetTimestamp { file_hash } => {
            get_timestamp(accounts, file_hash)
        }
    }
}

fn initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    admin: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let state_account = next_account_info(account_info_iter)?;

    if state_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let state = ProgramState {
        admin,
        record_count: 0,
    };

    state.serialize(&mut &mut state_account.data.borrow_mut()[..])?;

    msg!("Program initialized with admin: {}", admin);
    Ok(())
}

fn add_timestamp(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    file_hash: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let state_account = next_account_info(account_info_iter)?;
    let timestamp_account = next_account_info(account_info_iter)?;
