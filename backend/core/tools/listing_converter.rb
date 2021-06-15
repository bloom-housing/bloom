require 'active_support/core_ext/hash'
require 'active_support/core_ext/integer/inflections'
require 'json'
require 'byebug'
require 'geocoder'

class ListingConverter
  KEY_PAIRS = {
    application_city: %w[applicationAddress city],
    application_street: %w[applicationAddress street],
    application_postal_code: %w[applicationAddress zipCode],
    application_state: %w[applicationAddress state],
    application_street_address: %w[applicationAddress street],
    building_city: %w[buildingAddress city],
    building_street: %w[buildingAddress street],
    building_postal_code: %w[buildingAddress zipCode],
    building_zip_code: %w[buildingAddress zipCode],
    building_state: %w[buildingAddress state],
    building_street_address: %w[buildingAddress street],
    leasing_agent_city: %w[leasingAgentAddress city],
    leasing_agent_street: %w[leasingAgentAddress street],
    leasing_agent_zip: %w[leasingAgentAddress zipCode],
    leasing_agent_state: %w[leasingAgentAddress state],
    leasing_agent_street_address: %w[leasingAgentAddress street],
    accepts_postmark: %w[acceptsPostmarkedApplications],
    postmark_due_date: %w[postmarkedApplicationsReceivedByDate],
    application_download_url: %w[attachments fileUrl]
  }.with_indifferent_access.freeze

  def initialize(file_name)
    file = File.read(file_name)
    @json = JSON.parse(file)
  end

  def call
    listings = []

    @json.each do |listing|
      new_listing = {}
      listing.each do |key, value|
        if KEY_PAIRS[key]
          index = 0
          KEY_PAIRS[key].inject(new_listing) do |memo, k|
            if index == KEY_PAIRS[key].size - 1
              memo[k] = convert(value)
            elsif memo[k].nil?
              memo[k] = {}
            end
            index += 1
            memo[k]
          end
        else
          new_listing[key.camelize(:lower)] = convert(value)
        end
      end
      if new_listing['attachments'].present?
        attachment = new_listing['attachments']
        attachment['label'] = 'English'
        attachment['type'] = 1
        new_listing['attachments'] = [attachment]
      end
      geocode(new_listing)
      new_listing.delete 'unitSummaries'
      listings << new_listing
    end
    listings
  end

  # Loading listings from dahlia-listings app
  def load_listings(group_id)
    Time::DATE_FORMATS[:default] = '%Y-%m-%dT%H:%M:%S.%LZ'
    @group = Group.find(group_id)
    @listings_scope = @group.listings_for_self_and_descendants
    listings = @listings_scope
    json_listings = []

    listings.each do |listing|
      json_listing = listing.as_json
      # unit_summaries = ListingService.create_unit_summaries(listing)
      # json_listing[:unit_summaries] = unit_summaries
      json_listing[:total_units] = listing.units.count
      json_listing[:units_available] = listing.units.available.count
      json_listing[:units] = listing.units
      json_listing[:preferences] = listing.preferences
      if json_listing['reserved_descriptor'].present?
        json_listing['reserved_descriptor'] = [{ name: json_listing['reserved_descriptor'] }]
      end
      json_listings << json_listing
    end
    puts JSON.pretty_generate json_listings.as_json
  end

  private

  def geocode(listing)
    %w[applicationAddress buildingAddress leasingAgentAddress].each do |address|
      query = listing[address].slice('street', 'city', 'zipCode').values.join(', ')
      position = Geocoder.search(query).first
      if position
        listing[address]['latitude'] = position.latitude
        listing[address]['longitude'] = position.longitude
      end
    end
  end

  def preferences(listing)
    old_preferences = listing['preferences']
    new_preferences = []
    old_preferences.sort_by{|p| p['order'] }.each_with_index do |preference, i|
      new_preferences << {
        ordinal: (i + 1).ordinalize,
        title: preference['name'],
        subtitle: "Up to #{preference['availableUnitsCount']} units available",
        description: preference['description'],
        links: []
      }
    end
    listing['preferences'] = new_preferences
  end

  def convert(value)
    if value.is_a? Hash
      camelized = {}
      value.each do |k, v|
        camelized[k.camelize(:lower)] = convert(v)
      end
      camelized
    elsif value.is_a? Array
      value.map { |v| convert(v) }
    else
      value
    end
  end
end
