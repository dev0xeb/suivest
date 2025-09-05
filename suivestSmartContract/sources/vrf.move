module suivest::vrf {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::hash;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::option::{Self, Option};

    use suivest::errors;
    use suivest::events;

    /// VRF request object that gets created when randomness is requested
    public struct VRFRequest has key, store {
        id: UID,
        requester: address,
        round_id: u64,
        seed: vector<u8>,
        timestamp: u64,
        fulfilled: bool,
    }

    /// VRF response containing the random value and proof
    public struct VRFResponse has key, store {
        id: UID,
        request_id: address,
        randomness: vector<u8>,
        proof: vector<u8>,
        timestamp: u64,
    }

    /// VRF oracle capability (only oracle can fulfill requests)
    public struct VRFOracleCap has key, store {
        id: UID,
        oracle_address: address,
    }

    /// VRF registry for managing requests and responses
    public struct VRFRegistry has key {
        id: UID,
        requests: vector<VRFRequest>,
        responses: vector<VRFResponse>,
        oracle_cap: Option<VRFOracleCap>,
        min_confirmations: u64,
        request_timeout: u64,
    }

    /// Events
    public struct VRFRequested has copy, drop {
        pub request_id: address,
        pub requester: address,
        pub round_id: u64,
        pub timestamp: u64,
    }

    public struct VRFResponseReceived has copy, drop {
        pub request_id: address,
        pub randomness: vector<u8>,
        pub timestamp: u64,
    }

    // ========== Initialization ==========

    /// Initialize VRF registry
    public fun init_vrf_registry(
        oracle_address: address,
        min_confirmations: u64,
        request_timeout: u64,
        ctx: &mut TxContext
    ): (VRFRegistry, VRFOracleCap) {
        let oracle_cap = VRFOracleCap {
            id: object::new(ctx),
            oracle_address,
        };

        let registry = VRFRegistry {
            id: object::new(ctx),
            requests: vector::empty<VRFRequest>(),
            responses: vector::empty<VRFResponse>(),
            oracle_cap: option::some(oracle_cap),
            min_confirmations,
            request_timeout,
        };

        (registry, oracle_cap)
    }

    // ========== Request Randomness ==========

    /// Request randomness for a specific round
    public entry fun request_randomness(
        registry: &mut VRFRegistry,
        round_id: u64,
        seed: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let requester = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Create VRF request
        let request = VRFRequest {
            id: object::new(ctx),
            requester,
            round_id,
            seed,
            timestamp,
            fulfilled: false,
        };

        // Add to registry
        vector::push_back(&mut registry.requests, request);

        // Emit event
        event::emit(VRFRequested {
            request_id: object::uid_to_address(&object::id(&vector::back(&registry.requests))),
            requester,
            round_id,
            timestamp,
        });
    }

    // ========== Fulfill Randomness (Oracle Only) ==========

    /// Fulfill a VRF request (only callable by oracle)
    public entry fun fulfill_randomness(
        registry: &mut VRFRegistry,
        oracle_cap: &VRFOracleCap,
        request_id: address,
        randomness: vector<u8>,
        proof: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify oracle authorization
        assert!(tx_context::sender(ctx) == oracle_cap.oracle_address, errors::E_UNAUTHORIZED);

        let timestamp = clock::timestamp_ms(clock);

        // Find and validate request
        let request_index = find_request_index(registry, request_id);
        assert!(request_index < vector::length(&registry.requests), errors::E_INVALID_ADDRESS);

        let request = vector::borrow_mut(&mut registry.requests, request_index);
        assert!(!request.fulfilled, errors::E_ALREADY_CLAIMED);

        // Verify request hasn't timed out
        let time_since_request = timestamp - request.timestamp;
        assert!(time_since_request <= registry.request_timeout, errors::E_INVALID_TIMESTAMP);

        // Mark request as fulfilled
        request.fulfilled = true;

        // Create response
        let response = VRFResponse {
            id: object::new(ctx),
            request_id,
            randomness,
            proof,
            timestamp,
        };

        // Add to registry
        vector::push_back(&mut registry.responses, response);

        // Emit event
        event::emit(VRFResponseReceived {
            request_id,
            randomness,
            timestamp,
        });
    }

    // ========== Mock VRF Implementation ==========

    /// Mock VRF for testing (replace with real VRF service in production)
    public entry fun mock_fulfill_randomness(
        registry: &mut VRFRegistry,
        request_id: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);

        // Find request
        let request_index = find_request_index(registry, request_id);
        assert!(request_index < vector::length(&registry.requests), errors::E_INVALID_ADDRESS);

        let request = vector::borrow_mut(&mut registry.requests, request_index);
        assert!(!request.fulfilled, errors::E_ALREADY_CLAIMED);

        // Mark as fulfilled
        request.fulfilled = true;

        // Generate mock randomness (replace with real VRF)
        let mut seed_data = request.seed;
        vector::append(&mut seed_data, tx_context::digest(ctx));
        let randomness = hash::blake2b256(&seed_data);
        let proof = hash::sha3_256(&randomness); // Mock proof

        // Create response
        let response = VRFResponse {
            id: object::new(ctx),
            request_id,
            randomness,
            proof,
            timestamp,
        };

        // Add to registry
        vector::push_back(&mut registry.responses, response);

        // Emit event
        event::emit(VRFResponseReceived {
            request_id,
            randomness,
            timestamp,
        });
    }

    // ========== View Functions ==========

    /// Get randomness for a specific request
    public fun get_randomness(registry: &VRFRegistry, request_id: address): Option<vector<u8>> {
        let i = 0;
        while (i < vector::length(&registry.responses)) {
            let response = vector::borrow(&registry.responses, i);
            if (response.request_id == request_id) {
                return option::some(response.randomness);
            };
            i = i + 1;
        };
        option::none<vector<u8>>()
    }

    /// Check if a request is fulfilled
    public fun is_request_fulfilled(registry: &VRFRegistry, request_id: address): bool {
        let i = 0;
        while (i < vector::length(&registry.requests)) {
            let request = vector::borrow(&registry.requests, i);
            if (object::uid_to_address(&request.id) == request_id) {
                return request.fulfilled;
            };
            i = i + 1;
        };
        false
    }

    /// Get pending requests count
    public fun get_pending_requests_count(registry: &VRFRegistry): u64 {
        let mut count = 0u64;
        let i = 0;
        while (i < vector::length(&registry.requests)) {
            let request = vector::borrow(&registry.requests, i);
            if (!request.fulfilled) {
                count = count + 1;
            };
            i = i + 1;
        };
        count
    }

    /// Convert randomness bytes to u128 for lottery selection
    public fun randomness_to_u128(randomness: &vector<u8>): u128 {
        let mut result: u128 = 0;
        let length = vector::length(randomness);
        let max_bytes = if (length < 16) { length } else { 16 };
        
        let i = 0;
        while (i < max_bytes) {
            let byte = *vector::borrow(randomness, i);
            result = (result << 8) + (byte as u128);
            i = i + 1;
        };
        
        result
    }

    // ========== Admin Functions ==========

    /// Update oracle address (only current oracle)
    public entry fun update_oracle(
        registry: &mut VRFRegistry,
        oracle_cap: &mut VRFOracleCap,
        new_oracle_address: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == oracle_cap.oracle_address, errors::E_UNAUTHORIZED);
        oracle_cap.oracle_address = new_oracle_address;
    }

    /// Update registry configuration
    public entry fun update_registry_config(
        registry: &mut VRFRegistry,
        oracle_cap: &VRFOracleCap,
        new_min_confirmations: u64,
        new_request_timeout: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == oracle_cap.oracle_address, errors::E_UNAUTHORIZED);
        registry.min_confirmations = new_min_confirmations;
        registry.request_timeout = new_request_timeout;
    }

    // ========== Internal Functions ==========

    /// Find request index by ID
    fun find_request_index(registry: &VRFRegistry, request_id: address): u64 {
        let i = 0;
        while (i < vector::length(&registry.requests)) {
            let request = vector::borrow(&registry.requests, i);
            if (object::uid_to_address(&request.id) == request_id) {
                return i;
            };
            i = i + 1;
        };
        vector::length(&registry.requests) // Return length if not found
    }

    /// Clean up old requests and responses (admin function)
    public entry fun cleanup_old_entries(
        registry: &mut VRFRegistry,
        oracle_cap: &VRFOracleCap,
        max_age: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == oracle_cap.oracle_address, errors::E_UNAUTHORIZED);
        
        let current_time = clock::timestamp_ms(clock);
        
        // Clean up old requests
        let i = 0;
        while (i < vector::length(&registry.requests)) {
            let request = vector::borrow(&registry.requests, i);
            if (current_time - request.timestamp > max_age) {
                // Remove old request
                vector::remove(&mut registry.requests, i);
            } else {
                i = i + 1;
            };
        };

        // Clean up old responses
        let i = 0;
        while (i < vector::length(&registry.responses)) {
            let response = vector::borrow(&registry.responses, i);
            if (current_time - response.timestamp > max_age) {
                // Remove old response
                vector::remove(&mut registry.responses, i);
            } else {
                i = i + 1;
            };
        };
    }
} 