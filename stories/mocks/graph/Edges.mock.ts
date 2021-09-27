export const edges = [
  {
    id: 'power_sim_output_full-power_sim_output',
    source: 'power_sim_output_full',
    target: 'power_sim_output',
  },
  {
    id: 'match_history-matches_without_nuna_pcp_available',
    source: 'match_history',
    target: 'matches_without_nuna_pcp_available',
  },
  {
    id: 'match_history_providers-matches_without_nuna_pcp_available',
    source: 'match_history_providers',
    target: 'matches_without_nuna_pcp_available',
  },
  {
    id: 'matches_without_nuna_pcp_available-matches_without_nuna_pcp_available_plus_exclusion_info',
    source: 'matches_without_nuna_pcp_available',
    target: 'matches_without_nuna_pcp_available_plus_exclusion_info',
  },
  {
    id: 'experiment_assignments-matches_without_nuna_pcp_available_plus_exclusion_info',
    source: 'experiment_assignments',
    target: 'matches_without_nuna_pcp_available_plus_exclusion_info',
  },
  {
    id: 'experiment_exclusions-matches_without_nuna_pcp_available_plus_exclusion_info',
    source: 'experiment_exclusions',
    target: 'matches_without_nuna_pcp_available_plus_exclusion_info',
  },
  {
    id: 'match_history-matches_excluded_from_experiment',
    source: 'match_history',
    target: 'matches_excluded_from_experiment',
  },
  {
    id: 'experiment_assignments-matches_excluded_from_experiment',
    source: 'experiment_assignments',
    target: 'matches_excluded_from_experiment',
  },
  {
    id: 'experiment_exclusions-matches_excluded_from_experiment',
    source: 'experiment_exclusions',
    target: 'matches_excluded_from_experiment',
  },
  {
    id: 'match_history_providers-matches_excluded_from_experiment',
    source: 'match_history_providers',
    target: 'matches_excluded_from_experiment',
  },
  {
    id: 'matches_excluded_from_experiment-matches_excluded_from_experiment_subset_not_rejected',
    source: 'matches_excluded_from_experiment',
    target: 'matches_excluded_from_experiment_subset_not_rejected',
  },
  {
    id: 'matches_excluded_from_experiment_subset_not_rejected-accepted_matches_excluded',
    source: 'matches_excluded_from_experiment_subset_not_rejected',
    target: 'accepted_matches_excluded',
  },
  {
    id: 'assignment_history-accepted_matches_excluded',
    source: 'assignment_history',
    target: 'accepted_matches_excluded',
  },
  {
    id: 'assignment_history-flag_accepted_assignments',
    source: 'assignment_history',
    target: 'flag_accepted_assignments',
  },
  {
    id: 'assignment_history-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'assignment_history',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'experiment_assignments-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'experiment_assignments',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'experiment_exclusions-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'experiment_exclusions',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'flag_accepted_assignments-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'flag_accepted_assignments',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'match_history-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'match_history',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'pcpm_boe_crosswalk-accepted_acknowledged_non_excluded_matches_w_treatment',
    source: 'pcpm_boe_crosswalk',
    target: 'accepted_acknowledged_non_excluded_matches_w_treatment',
  },
  {
    id: 'recent_provider_extract-other_pcps',
    source: 'recent_provider_extract',
    target: 'other_pcps',
  },
  { id: 'AVRA_attribution-other_pcps', source: 'AVRA_attribution', target: 'other_pcps' },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-count_matches_by_csid_and_affiliation',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'count_matches_by_csid_and_affiliation',
  },
  {
    id: 'match_results-count_matches_by_csid_and_affiliation',
    source: 'match_results',
    target: 'count_matches_by_csid_and_affiliation',
  },
  {
    id: 'recent_provider_extract-count_matches_by_csid_and_affiliation',
    source: 'recent_provider_extract',
    target: 'count_matches_by_csid_and_affiliation',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-count_matches_by_csid_and_capacity_affiliation',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'count_matches_by_csid_and_capacity_affiliation',
  },
  {
    id: 'match_results-count_matches_by_csid_and_capacity_affiliation',
    source: 'match_results',
    target: 'count_matches_by_csid_and_capacity_affiliation',
  },
  {
    id: 'recent_provider_extract-count_matches_by_csid_and_capacity_affiliation',
    source: 'recent_provider_extract',
    target: 'count_matches_by_csid_and_capacity_affiliation',
  },
  {
    id: 'match_value_table-match_values_for_all_member_profiles_excl_unknown_gender',
    source: 'match_value_table',
    target: 'match_values_for_all_member_profiles_excl_unknown_gender',
  },
  {
    id: 'demographic_capacity_cost-match_values_for_all_member_profiles_excl_unknown_gender',
    source: 'demographic_capacity_cost',
    target: 'match_values_for_all_member_profiles_excl_unknown_gender',
  },
  {
    id: 'compliance_adj_match_values-match_values_for_all_member_profiles_excl_unknown_gender',
    source: 'compliance_adj_match_values',
    target: 'match_values_for_all_member_profiles_excl_unknown_gender',
  },
  {
    id: 'filtered_valid_matches-match_values_for_all_member_profiles_excl_unknown_gender',
    source: 'filtered_valid_matches',
    target: 'match_values_for_all_member_profiles_excl_unknown_gender',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-transactions_with_all_valid_pcp_options',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'transactions_with_all_valid_pcp_options',
  },
  {
    id: 'match_values_for_all_member_profiles_excl_unknown_gender-transactions_with_all_valid_pcp_options',
    source: 'match_values_for_all_member_profiles_excl_unknown_gender',
    target: 'transactions_with_all_valid_pcp_options',
  },
  {
    id: 'nearest_member_provider_address-nearest_member_provider_address2',
    source: 'nearest_member_provider_address',
    target: 'nearest_member_provider_address2',
  },
  {
    id: 'nearest_member_provider_address2-closest_travel_time',
    source: 'nearest_member_provider_address2',
    target: 'closest_travel_time',
  },
  {
    id: 'nearest_member_provider_address2-pcps_nearby_to_mem_zipcode',
    source: 'nearest_member_provider_address2',
    target: 'pcps_nearby_to_mem_zipcode',
  },
  {
    id: 'closest_travel_time-pcps_nearby_to_mem_zipcode',
    source: 'closest_travel_time',
    target: 'pcps_nearby_to_mem_zipcode',
  },
  {
    id: 'transactions_with_all_valid_pcp_options-transactions_with_all_valid_and_closest_pcp_options',
    source: 'transactions_with_all_valid_pcp_options',
    target: 'transactions_with_all_valid_and_closest_pcp_options',
  },
  {
    id: 'pcps_nearby_to_mem_zipcode-transactions_with_all_valid_and_closest_pcp_options',
    source: 'pcps_nearby_to_mem_zipcode',
    target: 'transactions_with_all_valid_and_closest_pcp_options',
  },
  {
    id: 'transactions_with_all_valid_and_closest_pcp_options-lowest_match_value_per_transaction',
    source: 'transactions_with_all_valid_and_closest_pcp_options',
    target: 'lowest_match_value_per_transaction',
  },
  {
    id: 'transactions_with_all_valid_and_closest_pcp_options-unconstrained_PCPs_tmp',
    source: 'transactions_with_all_valid_and_closest_pcp_options',
    target: 'unconstrained_PCPs_tmp',
  },
  {
    id: 'lowest_match_value_per_transaction-unconstrained_PCPs_tmp',
    source: 'lowest_match_value_per_transaction',
    target: 'unconstrained_PCPs_tmp',
  },
  {
    id: 'unconstrained_PCPs_tmp-unconstrained_PCPs',
    source: 'unconstrained_PCPs_tmp',
    target: 'unconstrained_PCPs',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-accepted_matches_w_unconstrained_pcp',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'accepted_matches_w_unconstrained_pcp',
  },
  {
    id: 'unconstrained_PCPs-accepted_matches_w_unconstrained_pcp',
    source: 'unconstrained_PCPs',
    target: 'accepted_matches_w_unconstrained_pcp',
  },
  {
    id: 'accepted_matches_w_unconstrained_pcp-accepted_matches_w_nuna_match_cost_and_quality',
    source: 'accepted_matches_w_unconstrained_pcp',
    target: 'accepted_matches_w_nuna_match_cost_and_quality',
  },
  {
    id: 'match_values_for_all_member_profiles_excl_unknown_gender-accepted_matches_w_nuna_match_cost_and_quality',
    source: 'match_values_for_all_member_profiles_excl_unknown_gender',
    target: 'accepted_matches_w_nuna_match_cost_and_quality',
  },
  {
    id: 'accepted_matches_w_nuna_match_cost_and_quality-accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    source: 'accepted_matches_w_nuna_match_cost_and_quality',
    target: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
  },
  {
    id: 'match_values_for_all_member_profiles_excl_unknown_gender-accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    source: 'match_values_for_all_member_profiles_excl_unknown_gender',
    target: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
  },
  {
    id: 'accepted_matches_w_nuna_match_cost_and_quality-matches_with_cs_default_pcp',
    source: 'accepted_matches_w_nuna_match_cost_and_quality',
    target: 'matches_with_cs_default_pcp',
  },
  {
    id: 'match_requests-matches_with_cs_default_pcp',
    source: 'match_requests',
    target: 'matches_with_cs_default_pcp',
  },
  {
    id: 'pdb_provider_address-matches_with_cs_default_pcp',
    source: 'pdb_provider_address',
    target: 'matches_with_cs_default_pcp',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-matches_with_cs_default_pcp_without_match_values',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'matches_with_cs_default_pcp_without_match_values',
  },
  {
    id: 'match_requests-matches_with_cs_default_pcp_without_match_values',
    source: 'match_requests',
    target: 'matches_with_cs_default_pcp_without_match_values',
  },
  {
    id: 'pdb_provider_address-matches_with_cs_default_pcp_without_match_values',
    source: 'pdb_provider_address',
    target: 'matches_with_cs_default_pcp_without_match_values',
  },
  {
    id: 'matches_with_cs_default_pcp_without_match_values-num_matches_with_nuna_pcp_equal_caresource_pcp',
    source: 'matches_with_cs_default_pcp_without_match_values',
    target: 'num_matches_with_nuna_pcp_equal_caresource_pcp',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-num_matches_with_nuna_pcp_equal_caresource_pcp',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'num_matches_with_nuna_pcp_equal_caresource_pcp',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-compare_nuna_pcp_with_cs_pcp_in_treated_group',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'compare_nuna_pcp_with_cs_pcp_in_treated_group',
  },
  {
    id: 'match_requests-compare_nuna_pcp_with_cs_pcp_in_treated_group',
    source: 'match_requests',
    target: 'compare_nuna_pcp_with_cs_pcp_in_treated_group',
  },
  {
    id: 'experiment_assignments-compare_nuna_pcp_with_cs_pcp_in_treated_group',
    source: 'experiment_assignments',
    target: 'compare_nuna_pcp_with_cs_pcp_in_treated_group',
  },
  {
    id: 'match_results-compare_nuna_pcp_with_cs_pcp_in_treated_group',
    source: 'match_results',
    target: 'compare_nuna_pcp_with_cs_pcp_in_treated_group',
  },
  {
    id: 'matches_with_cs_default_pcp-accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    source: 'matches_with_cs_default_pcp',
    target: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
  },
  {
    id: 'match_values_for_all_member_profiles_excl_unknown_gender-accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    source: 'match_values_for_all_member_profiles_excl_unknown_gender',
    target: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-percent_of_transactions_without_enough_data_to_directly_compare',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'percent_of_transactions_without_enough_data_to_directly_compare',
  },
  {
    id: 'accepted_matches_w_nuna_match_cost_and_quality-percent_of_transactions_without_enough_data_to_directly_compare',
    source: 'accepted_matches_w_nuna_match_cost_and_quality',
    target: 'percent_of_transactions_without_enough_data_to_directly_compare',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-accepted_matches_w_nuna_match_and_cs_match_cost_and_quality_w_log_mv',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality_w_log_mv',
  },
  {
    id: 'power_sim_output-savings_rate_with_power_sim_output',
    source: 'power_sim_output',
    target: 'savings_rate_with_power_sim_output',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality_w_log_mv-savings_rate_with_power_sim_output',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality_w_log_mv',
    target: 'savings_rate_with_power_sim_output',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-total_annualized_savings',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'total_annualized_savings',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-total_annualized_savings',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'total_annualized_savings',
  },
  {
    id: 'savings_rate_with_power_sim_output-total_annualized_savings',
    source: 'savings_rate_with_power_sim_output',
    target: 'total_annualized_savings',
  },
  {
    id: 'power_sim_output-total_annualized_savings',
    source: 'power_sim_output',
    target: 'total_annualized_savings',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-comp_cost_to_cs_matches_by_dem',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'comp_cost_to_cs_matches_by_dem',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-comp_cost_to_cs_matches_by_boe',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'comp_cost_to_cs_matches_by_boe',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-quality_improvement_performance',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'quality_improvement_performance',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-comp_quality_to_cs_matches_by_dem',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'comp_quality_to_cs_matches_by_dem',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-comp_quality_to_cs_matches_by_boe',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'comp_quality_to_cs_matches_by_boe',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality_w_log_mv',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality_w_log_mv',
  },
  {
    id: 'power_sim_output-unconstrained_savings_rate_with_power_sim_output',
    source: 'power_sim_output',
    target: 'unconstrained_savings_rate_with_power_sim_output',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality_w_log_mv-unconstrained_savings_rate_with_power_sim_output',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality_w_log_mv',
    target: 'unconstrained_savings_rate_with_power_sim_output',
  },
  {
    id: 'recent_provider_extract-provider_info_primary_address_only',
    source: 'recent_provider_extract',
    target: 'provider_info_primary_address_only',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-nuna_match_provider_info',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'nuna_match_provider_info',
  },
  {
    id: 'match_results-nuna_match_provider_info',
    source: 'match_results',
    target: 'nuna_match_provider_info',
  },
  {
    id: 'provider_info_primary_address_only-nuna_match_provider_info',
    source: 'provider_info_primary_address_only',
    target: 'nuna_match_provider_info',
  },
  {
    id: 'matches_with_cs_default_pcp_without_match_values-matches_with_cs_default_pcp_without_match_values_w_group',
    source: 'matches_with_cs_default_pcp_without_match_values',
    target: 'matches_with_cs_default_pcp_without_match_values_w_group',
  },
  {
    id: 'provider_info_primary_address_only-matches_with_cs_default_pcp_without_match_values_w_group',
    source: 'provider_info_primary_address_only',
    target: 'matches_with_cs_default_pcp_without_match_values_w_group',
  },
  {
    id: 'matches_with_cs_default_pcp_without_match_values_w_group-num_matches_with_nuna_group_equal_caresource_group',
    source: 'matches_with_cs_default_pcp_without_match_values_w_group',
    target: 'num_matches_with_nuna_group_equal_caresource_group',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-num_matches_with_nuna_group_equal_caresource_group',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'num_matches_with_nuna_group_equal_caresource_group',
  },
  {
    id: 'nuna_match_provider_info-nuna_match_metrics',
    source: 'nuna_match_provider_info',
    target: 'nuna_match_metrics',
  },
  {
    id: 'num_matches_with_nuna_group_equal_caresource_group-nuna_match_metrics',
    source: 'num_matches_with_nuna_group_equal_caresource_group',
    target: 'nuna_match_metrics',
  },
  {
    id: 'num_matches_with_nuna_pcp_equal_caresource_pcp-nuna_match_metrics',
    source: 'num_matches_with_nuna_pcp_equal_caresource_pcp',
    target: 'nuna_match_metrics',
  },
  {
    id: 'assignment_history-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'assignment_history',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'experiment_assignments-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'experiment_assignments',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'experiment_exclusions-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'experiment_exclusions',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'flag_accepted_assignments-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'flag_accepted_assignments',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'match_history-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'match_history',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'pcpm_boe_crosswalk-accepted_acknowledged_non_excluded_matches_w_control',
    source: 'pcpm_boe_crosswalk',
    target: 'accepted_acknowledged_non_excluded_matches_w_control',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_control-control_provider_info',
    source: 'accepted_acknowledged_non_excluded_matches_w_control',
    target: 'control_provider_info',
  },
  {
    id: 'match_requests-control_provider_info',
    source: 'match_requests',
    target: 'control_provider_info',
  },
  {
    id: 'provider_info_primary_address_only-control_provider_info',
    source: 'provider_info_primary_address_only',
    target: 'control_provider_info',
  },
  {
    id: 'control_provider_info-control_match_metrics',
    source: 'control_provider_info',
    target: 'control_match_metrics',
  },
  {
    id: 'nuna_match_provider_info-overlap_providers',
    source: 'nuna_match_provider_info',
    target: 'overlap_providers',
  },
  {
    id: 'control_provider_info-overlap_providers',
    source: 'control_provider_info',
    target: 'overlap_providers',
  },
  {
    id: 'nuna_match_provider_info-overlap_practices',
    source: 'nuna_match_provider_info',
    target: 'overlap_practices',
  },
  {
    id: 'control_provider_info-overlap_practices',
    source: 'control_provider_info',
    target: 'overlap_practices',
  },
  {
    id: 'control_provider_info-all_control_matches_w_overlap_flags',
    source: 'control_provider_info',
    target: 'all_control_matches_w_overlap_flags',
  },
  {
    id: 'overlap_providers-all_control_matches_w_overlap_flags',
    source: 'overlap_providers',
    target: 'all_control_matches_w_overlap_flags',
  },
  {
    id: 'overlap_practices-all_control_matches_w_overlap_flags',
    source: 'overlap_practices',
    target: 'all_control_matches_w_overlap_flags',
  },
  {
    id: 'overlap_providers-overlap_metric_1',
    source: 'overlap_providers',
    target: 'overlap_metric_1',
  },
  {
    id: 'overlap_practices-overlap_metric_2',
    source: 'overlap_practices',
    target: 'overlap_metric_2',
  },
  {
    id: 'all_control_matches_w_overlap_flags-overlap_metric_3',
    source: 'all_control_matches_w_overlap_flags',
    target: 'overlap_metric_3',
  },
  {
    id: 'all_control_matches_w_overlap_flags-overlap_metric_4',
    source: 'all_control_matches_w_overlap_flags',
    target: 'overlap_metric_4',
  },
  {
    id: 'all_control_matches_w_overlap_flags-top_10_practices_cs_matches',
    source: 'all_control_matches_w_overlap_flags',
    target: 'top_10_practices_cs_matches',
  },
  {
    id: 'nuna_match_provider_info-nuna_matches_by_group',
    source: 'nuna_match_provider_info',
    target: 'nuna_matches_by_group',
  },
  {
    id: 'nuna_match_provider_info-overlap_provider_w_practice',
    source: 'nuna_match_provider_info',
    target: 'overlap_provider_w_practice',
  },
  {
    id: 'control_provider_info-overlap_provider_w_practice',
    source: 'control_provider_info',
    target: 'overlap_provider_w_practice',
  },
  {
    id: 'nuna_match_provider_info-all_matches_w_overlap_npi_practice',
    source: 'nuna_match_provider_info',
    target: 'all_matches_w_overlap_npi_practice',
  },
  {
    id: 'control_provider_info-all_matches_w_overlap_npi_practice',
    source: 'control_provider_info',
    target: 'all_matches_w_overlap_npi_practice',
  },
  {
    id: 'overlap_provider_w_practice-all_matches_w_overlap_npi_practice',
    source: 'overlap_provider_w_practice',
    target: 'all_matches_w_overlap_npi_practice',
  },
  {
    id: 'all_matches_w_overlap_npi_practice-groups_w_overlap_npi',
    source: 'all_matches_w_overlap_npi_practice',
    target: 'groups_w_overlap_npi',
  },
  { id: 'last_successful_run-sink @ 6:1', source: 'last_successful_run', target: 'sink @ 6:1' },
  { id: 'provider_address-sink @ 9:0', source: 'provider_address', target: 'sink @ 9:0' },
  { id: 'power_sim_output-sink @ 12:2', source: 'power_sim_output', target: 'sink @ 12:2' },
  {
    id: 'matches_without_nuna_pcp_available_plus_exclusion_info-sink @ 14:2',
    source: 'matches_without_nuna_pcp_available_plus_exclusion_info',
    target: 'sink @ 14:2',
  },
  {
    id: 'accepted_matches_excluded-sink @ 15:3',
    source: 'accepted_matches_excluded',
    target: 'sink @ 15:3',
  },
  { id: 'match_requests-sink @ 16:0', source: 'match_requests', target: 'sink @ 16:0' },
  { id: 'match_history-sink @ 17:0', source: 'match_history', target: 'sink @ 17:0' },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 19:2',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 19:2',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 20:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 20:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 21:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 21:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 23:1',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 23:1',
  },
  {
    id: 'AVRA_risk_adjuster__provider_measure-sink @ 23:1',
    source: 'AVRA_risk_adjuster__provider_measure',
    target: 'sink @ 23:1',
  },
  { id: 'other_pcps-sink @ 23:1', source: 'other_pcps', target: 'sink @ 23:1' },
  {
    id: 'count_matches_by_csid_and_affiliation-sink @ 24:1',
    source: 'count_matches_by_csid_and_affiliation',
    target: 'sink @ 24:1',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 25:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 25:0',
  },
  {
    id: 'count_matches_by_csid_and_affiliation-sink @ 25:0',
    source: 'count_matches_by_csid_and_affiliation',
    target: 'sink @ 25:0',
  },
  {
    id: 'count_matches_by_csid_and_capacity_affiliation-sink @ 26:1',
    source: 'count_matches_by_csid_and_capacity_affiliation',
    target: 'sink @ 26:1',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 27:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 27:0',
  },
  {
    id: 'count_matches_by_csid_and_affiliation-sink @ 27:0',
    source: 'count_matches_by_csid_and_affiliation',
    target: 'sink @ 27:0',
  },
  {
    id: 'count_matches_by_csid_and_capacity_affiliation-sink @ 27:0',
    source: 'count_matches_by_csid_and_capacity_affiliation',
    target: 'sink @ 27:0',
  },
  { id: 'match_value_table-sink @ 30:0', source: 'match_value_table', target: 'sink @ 30:0' },
  {
    id: 'match_values_for_all_member_profiles_excl_unknown_gender-sink @ 30:0',
    source: 'match_values_for_all_member_profiles_excl_unknown_gender',
    target: 'sink @ 30:0',
  },
  {
    id: 'transactions_with_all_valid_pcp_options-sink @ 33:0',
    source: 'transactions_with_all_valid_pcp_options',
    target: 'sink @ 33:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 33:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 33:0',
  },
  {
    id: 'transactions_with_all_valid_and_closest_pcp_options-sink @ 36:0',
    source: 'transactions_with_all_valid_and_closest_pcp_options',
    target: 'sink @ 36:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 36:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 36:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 37:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 37:0',
  },
  {
    id: 'transactions_with_all_valid_and_closest_pcp_options-sink @ 37:0',
    source: 'transactions_with_all_valid_and_closest_pcp_options',
    target: 'sink @ 37:0',
  },
  {
    id: 'transactions_with_all_valid_and_closest_pcp_options-sink @ 39:0',
    source: 'transactions_with_all_valid_and_closest_pcp_options',
    target: 'sink @ 39:0',
  },
  {
    id: 'lowest_match_value_per_transaction-sink @ 39:0',
    source: 'lowest_match_value_per_transaction',
    target: 'sink @ 39:0',
  },
  { id: 'unconstrained_PCPs-sink @ 39:0', source: 'unconstrained_PCPs', target: 'sink @ 39:0' },
  {
    id: 'accepted_matches_w_unconstrained_pcp-sink @ 40:1',
    source: 'accepted_matches_w_unconstrained_pcp',
    target: 'sink @ 40:1',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 40:1',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 40:1',
  },
  {
    id: 'accepted_matches_w_nuna_match_cost_and_quality-sink @ 43:0',
    source: 'accepted_matches_w_nuna_match_cost_and_quality',
    target: 'sink @ 43:0',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-sink @ 43:0',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'sink @ 43:0',
  },
  {
    id: 'accepted_matches_w_unconstrained_pcp-sink @ 43:0',
    source: 'accepted_matches_w_unconstrained_pcp',
    target: 'sink @ 43:0',
  },
  {
    id: 'matches_with_cs_default_pcp-sink @ 45:1',
    source: 'matches_with_cs_default_pcp',
    target: 'sink @ 45:1',
  },
  {
    id: 'matches_with_cs_default_pcp_without_match_values-sink @ 46:1',
    source: 'matches_with_cs_default_pcp_without_match_values',
    target: 'sink @ 46:1',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 46:1',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 46:1',
  },
  {
    id: 'num_matches_with_nuna_pcp_equal_caresource_pcp-sink @ 47:1',
    source: 'num_matches_with_nuna_pcp_equal_caresource_pcp',
    target: 'sink @ 47:1',
  },
  {
    id: 'compare_nuna_pcp_with_cs_pcp_in_treated_group-sink @ 48:1',
    source: 'compare_nuna_pcp_with_cs_pcp_in_treated_group',
    target: 'sink @ 48:1',
  },
  {
    id: 'percent_of_transactions_without_enough_data_to_directly_compare-sink @ 50:1',
    source: 'percent_of_transactions_without_enough_data_to_directly_compare',
    target: 'sink @ 50:1',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-sink @ 51:0',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'sink @ 51:0',
  },
  {
    id: 'savings_rate_with_power_sim_output-sink @ 54:2',
    source: 'savings_rate_with_power_sim_output',
    target: 'sink @ 54:2',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-sink @ 55:0',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'sink @ 55:0',
  },
  {
    id: 'savings_rate_with_power_sim_output-sink @ 56:0',
    source: 'savings_rate_with_power_sim_output',
    target: 'sink @ 56:0',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-sink @ 57:0',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'sink @ 57:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 58:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 58:0',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-sink @ 58:0',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'sink @ 58:0',
  },
  {
    id: 'total_annualized_savings-sink @ 59:1',
    source: 'total_annualized_savings',
    target: 'sink @ 59:1',
  },
  {
    id: 'total_annualized_savings-sink @ 60:1',
    source: 'total_annualized_savings',
    target: 'sink @ 60:1',
  },
  {
    id: 'comp_cost_to_cs_matches_by_dem-sink @ 62:1',
    source: 'comp_cost_to_cs_matches_by_dem',
    target: 'sink @ 62:1',
  },
  {
    id: 'comp_cost_to_cs_matches_by_boe-sink @ 64:1',
    source: 'comp_cost_to_cs_matches_by_boe',
    target: 'sink @ 64:1',
  },
  {
    id: 'quality_improvement_performance-sink @ 68:1',
    source: 'quality_improvement_performance',
    target: 'sink @ 68:1',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality-sink @ 69:0',
    source: 'accepted_matches_w_nuna_match_and_cs_match_cost_and_quality',
    target: 'sink @ 69:0',
  },
  {
    id: 'comp_quality_to_cs_matches_by_dem-sink @ 71:1',
    source: 'comp_quality_to_cs_matches_by_dem',
    target: 'sink @ 71:1',
  },
  {
    id: 'comp_quality_to_cs_matches_by_boe-sink @ 73:1',
    source: 'comp_quality_to_cs_matches_by_boe',
    target: 'sink @ 73:1',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-sink @ 77:0',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'sink @ 77:0',
  },
  {
    id: 'unconstrained_savings_rate_with_power_sim_output-sink @ 78:2',
    source: 'unconstrained_savings_rate_with_power_sim_output',
    target: 'sink @ 78:2',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-sink @ 79:0',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'sink @ 79:0',
  },
  {
    id: 'unconstrained_savings_rate_with_power_sim_output-sink @ 80:0',
    source: 'unconstrained_savings_rate_with_power_sim_output',
    target: 'sink @ 80:0',
  },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-sink @ 81:0',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'sink @ 81:0',
  },
  {
    id: 'savings_rate_with_power_sim_output-sink @ 82:0',
    source: 'savings_rate_with_power_sim_output',
    target: 'sink @ 82:0',
  },
  {
    id: 'unconstrained_savings_rate_with_power_sim_output-sink @ 82:0',
    source: 'unconstrained_savings_rate_with_power_sim_output',
    target: 'sink @ 82:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 82:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 82:0',
  },
  { id: 'power_sim_output-sink @ 82:0', source: 'power_sim_output', target: 'sink @ 82:0' },
  {
    id: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality-sink @ 83:0',
    source: 'accepted_matches_w_nuna_match_and_unconstrained_cost_and_quality',
    target: 'sink @ 83:0',
  },
  {
    id: 'accepted_acknowledged_non_excluded_matches_w_treatment-sink @ 85:0',
    source: 'accepted_acknowledged_non_excluded_matches_w_treatment',
    target: 'sink @ 85:0',
  },
  {
    id: 'total_annualized_savings-sink @ 85:0',
    source: 'total_annualized_savings',
    target: 'sink @ 85:0',
  },
  {
    id: 'quality_improvement_performance-sink @ 85:0',
    source: 'quality_improvement_performance',
    target: 'sink @ 85:0',
  },
  {
    id: 'num_matches_with_nuna_pcp_equal_caresource_pcp-sink @ 85:0',
    source: 'num_matches_with_nuna_pcp_equal_caresource_pcp',
    target: 'sink @ 85:0',
  },
  {
    id: 'recent_provider_extract-sink @ 87:0',
    source: 'recent_provider_extract',
    target: 'sink @ 87:0',
  },
  {
    id: 'nuna_match_provider_info-sink @ 88:2',
    source: 'nuna_match_provider_info',
    target: 'sink @ 88:2',
  },
  {
    id: 'control_provider_info-sink @ 90:2',
    source: 'control_provider_info',
    target: 'sink @ 90:2',
  },
  {
    id: 'control_match_metrics-sink @ 91:1',
    source: 'control_match_metrics',
    target: 'sink @ 91:1',
  },
  {
    id: 'control_provider_info-sink @ 94:0',
    source: 'control_provider_info',
    target: 'sink @ 94:0',
  },
  {
    id: 'all_control_matches_w_overlap_flags-sink @ 95:0',
    source: 'all_control_matches_w_overlap_flags',
    target: 'sink @ 95:0',
  },
  {
    id: 'top_10_practices_cs_matches-sink @ 96:5',
    source: 'top_10_practices_cs_matches',
    target: 'sink @ 96:5',
  },
  {
    id: 'nuna_matches_by_group-sink @ 96:5',
    source: 'nuna_matches_by_group',
    target: 'sink @ 96:5',
  },
  { id: 'groups_w_overlap_npi-sink @ 96:5', source: 'groups_w_overlap_npi', target: 'sink @ 96:5' },
  {
    id: 'nuna_match_provider_info-sink @ 97:0',
    source: 'nuna_match_provider_info',
    target: 'sink @ 97:0',
  },
  {
    id: 'control_provider_info-sink @ 97:0',
    source: 'control_provider_info',
    target: 'sink @ 97:0',
  },
]
