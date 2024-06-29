#![cfg_attr(feature = "nightly", feature(build_hasher_simple_hash_one))]

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

const FILE_HASH_SIZE: usize = 32;
const TIMESTAMP_RECORD_SIZE: usize = 40; // 32 bytes for file_hash + 8 bytes for timestamp
const PROGRAM_STATE_SIZE: usize = 40; // 32 bytes for admin + 8 bytes for record_count

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TimestampRecord {
    pub file_hash: [u8; FILE_HASH_SIZE],
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
    AddTimestamp { file_hash: [u8; FILE_HASH_SIZE] },
    GetTimestamp { file_hash: [u8; FILE_HASH_SIZE] },
}

#[derive(Error, Debug)]
pub enum TimestampError {
    #[error("Invalid instruction data")]
    InvalidInstructionData,
    #[error("Not authorized")]
    NotAuthorized,
    #[error("Record not found")]
    RecordNotFound,
    #[error("Incorrect program ID")]
    IncorrectProgramId,
    #[error("Missing required signature")]
    MissingRequiredSignature,
    #[error("Invalid account data")]
    InvalidAccountData,
    #[error("Account data too small")]
    AccountDataTooSmall,
}

impl From<TimestampError> for ProgramError {
    fn from(e: TimestampError) -> Self {
        match e {
            TimestampError::InvalidInstructionData => ProgramError::Custom(0),
            TimestampError::NotAuthorized => ProgramError::Custom(1),
            TimestampError::RecordNotFound => ProgramError::Custom(2),
            TimestampError::IncorrectProgramId => ProgramError::Custom(3),
            TimestampError::MissingRequiredSignature => ProgramError::Custom(4),
            TimestampError::InvalidAccountData => ProgramError::Custom(5),
            TimestampError::AccountDataTooSmall => ProgramError::Custom(6),
            // Add additional mappings as necessary
        }
    }
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
        return Err(TimestampError::IncorrectProgramId.into());
    }

    if state_account.data_len() < PROGRAM_STATE_SIZE {
        return Err(TimestampError::AccountDataTooSmall.into());
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
    file_hash: [u8; FILE_HASH_SIZE],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let state_account = next_account_info(account_info_iter)?;
    let timestamp_account = next_account_info(account_info_iter)?;
    let signer = next_account_info(account_info_iter)?;

    if !signer.is_signer {
        return Err(TimestampError::MissingRequiredSignature.into());
    }

    if state_account.owner != program_id {
        return Err(TimestampError::IncorrectProgramId.into());
    }

    if state_account.data_len() < PROGRAM_STATE_SIZE {
        return Err(TimestampError::AccountDataTooSmall.into());
    }

    if timestamp_account.data_len() < TIMESTAMP_RECORD_SIZE {
        return Err(TimestampError::AccountDataTooSmall.into());
    }

    let mut state = ProgramState::try_from_slice(&state_account.data.borrow())?;
    if state.admin != *signer.key {
        return Err(TimestampError::NotAuthorized.into());
    }

    let clock = Clock::get()?;
    let timestamp = clock.unix_timestamp;

    let record = TimestampRecord {
        file_hash,
        timestamp,
    };

    record.serialize(&mut &mut timestamp_account.data.borrow_mut()[..])?;

    state.record_count += 1;
    state.serialize(&mut &mut state_account.data.borrow_mut()[..])?;

    msg!("Timestamp added: {:?} at {}", record.file_hash, record.timestamp);
    Ok(())
}

fn get_timestamp(
    accounts: &[AccountInfo],
    file_hash: [u8; FILE_HASH_SIZE],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let timestamp_account = next_account_info(account_info_iter)?;

    if timestamp_account.data_len() < TIMESTAMP_RECORD_SIZE {
        return Err(TimestampError::AccountDataTooSmall.into());
    }

    let record = TimestampRecord::try_from_slice(&timestamp_account.data.borrow())?;

    if record.file_hash != file_hash {
        return Err(TimestampError::InvalidAccountData.into());
    }

    msg!("Timestamp for {:?}: {}", record.file_hash, record.timestamp);
    Ok(())
}