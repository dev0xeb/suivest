import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('wallet_address', 66).unique().notNullable();
    table.string('email', 255);
    table.string('username', 100);
    table.string('avatar_url', 500);
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('last_login_at');
    
    // Indexes
    table.index(['wallet_address']);
    table.index(['email']);
    table.index(['is_active']);
  });

  // Vaults table
  await knex.schema.createTable('vaults', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('token_type', 100).notNullable();
    table.string('token_symbol', 10).notNullable();
    table.string('token_name', 100).notNullable();
    table.integer('token_decimals').notNullable();
    table.string('vault_address', 66).unique().notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.decimal('total_deposits', 30, 0).defaultTo('0').notNullable();
    table.decimal('total_withdrawals', 30, 0).defaultTo('0').notNullable();
    table.decimal('total_prizes_distributed', 30, 0).defaultTo('0').notNullable();
    table.integer('active_participants').defaultTo(0).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index(['token_type']);
    table.index(['vault_address']);
    table.index(['is_active']);
  });

  // Prize draw rounds table
  await knex.schema.createTable('prize_draw_rounds', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vault_id').references('id').inTable('vaults').onDelete('CASCADE').notNullable();
    table.integer('round_id').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.integer('total_participants').defaultTo(0).notNullable();
    table.decimal('total_tickets', 30, 0).defaultTo('0').notNullable();
    table.decimal('prize_pool', 30, 0).defaultTo('0').notNullable();
    table.boolean('is_active').defaultTo(false).notNullable();
    table.boolean('is_finalized').defaultTo(false).notNullable();
    table.string('randomness_seed', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('finalized_at');
    
    // Indexes
    table.index(['vault_id']);
    table.index(['round_id']);
    table.index(['is_active']);
    table.index(['is_finalized']);
    table.index(['start_time']);
    table.index(['end_time']);
    table.unique(['vault_id', 'round_id']);
  });

  // User deposits table
  await knex.schema.createTable('user_deposits', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('vault_id').references('id').inTable('vaults').onDelete('CASCADE').notNullable();
    table.string('transaction_hash', 66).notNullable();
    table.decimal('amount', 30, 0).notNullable();
    table.decimal('tickets_minted', 30, 0).notNullable();
    table.integer('round_id').notNullable();
    table.enum('status', ['pending', 'confirmed', 'failed']).defaultTo('pending').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('confirmed_at');
    
    // Indexes
    table.index(['user_id']);
    table.index(['vault_id']);
    table.index(['transaction_hash']);
    table.index(['status']);
    table.index(['round_id']);
    table.index(['created_at']);
  });

  // User withdrawals table
  await knex.schema.createTable('user_withdrawals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('vault_id').references('id').inTable('vaults').onDelete('CASCADE').notNullable();
    table.string('transaction_hash', 66).notNullable();
    table.decimal('amount', 30, 0).notNullable();
    table.decimal('tickets_burned', 30, 0).notNullable();
    table.integer('round_id').notNullable();
    table.enum('status', ['pending', 'confirmed', 'failed']).defaultTo('pending').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('confirmed_at');
    
    // Indexes
    table.index(['user_id']);
    table.index(['vault_id']);
    table.index(['transaction_hash']);
    table.index(['status']);
    table.index(['round_id']);
    table.index(['created_at']);
  });

  // Prize winners table
  await knex.schema.createTable('prize_winners', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.uuid('round_id').references('id').inTable('prize_draw_rounds').onDelete('CASCADE').notNullable();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.string('wallet_address', 66).notNullable();
    table.integer('position').notNullable(); // 1, 2, or 3
    table.decimal('prize_amount', 30, 0).notNullable();
    table.boolean('has_claimed').defaultTo(false).notNullable();
    table.timestamp('claimed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index(['round_id']);
    table.index(['user_id']);
    table.index(['wallet_address']);
    table.index(['position']);
    table.index(['has_claimed']);
  });

  // User streaks table
  await knex.schema.createTable('user_streaks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('vault_id').references('id').inTable('vaults').onDelete('CASCADE').notNullable();
    table.integer('current_streak').defaultTo(0).notNullable();
    table.integer('longest_streak').defaultTo(0).notNullable();
    table.integer('rounds_participated').defaultTo(0).notNullable();
    table.integer('last_participation_round').defaultTo(0).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index(['user_id']);
    table.index(['vault_id']);
    table.index(['current_streak']);
    table.index(['longest_streak']);
    table.unique(['user_id', 'vault_id']);
  });

  // Contract events table
  await knex.schema.createTable('contract_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('event_type', ['deposited', 'withdrawn', 'round_started', 'round_ended', 'prize_claimed', 'yield_harvested']).notNullable();
    table.uuid('vault_id').references('id').inTable('vaults').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('round_id').references('id').inTable('lottery_rounds').onDelete('CASCADE');
    table.string('transaction_hash', 66).notNullable();
    table.jsonb('event_data').notNullable();
    table.boolean('processed').defaultTo(false).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('processed_at');
    
    // Indexes
    table.index(['event_type']);
    table.index(['vault_id']);
    table.index(['user_id']);
    table.index(['round_id']);
    table.index(['transaction_hash']);
    table.index(['processed']);
    table.index(['created_at']);
  });

  // Admin actions table
  await knex.schema.createTable('admin_actions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('admin_user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.string('action_type', 100).notNullable();
    table.jsonb('action_data').notNullable();
    table.string('transaction_hash', 66);
    table.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('completed_at');
    
    // Indexes
    table.index(['admin_user_id']);
    table.index(['action_type']);
    table.index(['status']);
    table.index(['created_at']);
  });

  // System configuration table
  await knex.schema.createTable('system_config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('config_key', 100).unique().notNullable();
    table.text('config_value').notNullable();
    table.string('description', 500);
    table.boolean('is_encrypted').defaultTo(false).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index(['config_key']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('admin_actions');
  await knex.schema.dropTableIfExists('contract_events');
  await knex.schema.dropTableIfExists('user_streaks');
  await knex.schema.dropTableIfExists('prize_winners');
  await knex.schema.dropTableIfExists('user_withdrawals');
  await knex.schema.dropTableIfExists('user_deposits');
  await knex.schema.dropTableIfExists('prize_draw_rounds');
  await knex.schema.dropTableIfExists('vaults');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('system_config');
} 