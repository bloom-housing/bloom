import { Address, Button, MultiLineAddress, t } from "@bloom-housing/ui-components"
import GeocodeService from "@mapbox/mapbox-sdk/services/geocoding"

export interface FoundAddress {
  newAddress?: Address
  originalAddress?: Address
  invalid?: boolean
}

export const findValidatedAddress = (
  address: Address,
  setFoundAddress: React.Dispatch<React.SetStateAction<FoundAddress>>,
  setNewAddressSelected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const geocodingClient = GeocodeService({
    accessToken: process.env.mapBoxToken || process.env.MAPBOX_TOKEN,
  })

  geocodingClient
    .forwardGeocode({
      query: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
      limit: 1,
    })
    .send()
    .then((response) => {
      const [street, city, region] = response.body.features[0].place_name.split(", ")
      const regionElements = region.split(" ")
      const zipCode = regionElements[regionElements.length - 1]

      if (!zipCode) {
        setNewAddressSelected(false)
        setFoundAddress({ invalid: true, originalAddress: address })
      } else {
        setNewAddressSelected(true)
        setFoundAddress({
          originalAddress: address,
          newAddress: {
            street,
            street2: address.street2 && address.street2 !== "" ? address.street2 : undefined,
            city,
            state: address.state,
            zipCode,
          },
        })
      }
    })
    .catch((err) => {
      console.error(`Error calling Mapbox API: ${err}`)
      setNewAddressSelected(false)
      setFoundAddress({ invalid: true, originalAddress: address })
    })
}

interface AddressValidationSelectionProps {
  foundAddress: FoundAddress
  newAddressSelected: boolean
  setVerifyAddress: React.Dispatch<React.SetStateAction<boolean>>
  setNewAddressSelected: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddressValidationSelection = (props: AddressValidationSelectionProps) => {
  const { foundAddress, newAddressSelected, setNewAddressSelected, setVerifyAddress } = props
  return (
    <div className="form-card__group">
      {foundAddress.newAddress && (
        <fieldset>
          <legend className="field-note mb-4">{t("application.contact.suggestedAddress")}</legend>

          <div className="field field--inline">
            <input
              type="radio"
              name="chooseaddress"
              id="foundaddress"
              value="found"
              checked={newAddressSelected}
              onChange={(e) => setNewAddressSelected(e.target.checked)}
            />
            <label htmlFor="foundaddress" className="font-alt-sans font-semibold">
              <MultiLineAddress
                address={{
                  street: foundAddress.newAddress.street2
                    ? `${foundAddress.newAddress.street}<br/>${foundAddress.newAddress.street2}`
                    : foundAddress.newAddress.street,
                  city: foundAddress.newAddress.city,
                  state: foundAddress.newAddress.state,
                  zipCode: foundAddress.newAddress.zipCode,
                }}
              />
            </label>
          </div>
        </fieldset>
      )}
      {foundAddress.invalid && <p>[couldn't find a verified address]</p>}
      {foundAddress.originalAddress && (
        <fieldset className="mt-6">
          <legend className="field-note mb-4">{t("application.contact.youEntered")}</legend>

          <div className="flex items-start">
            <div className="field field--inline">
              <input
                type="radio"
                name="chooseaddress"
                id="originaladdress"
                value="original"
                checked={!newAddressSelected}
                onChange={(e) => setNewAddressSelected(!e.target.checked)}
              />
              <label htmlFor="originaladdress" className="font-alt-sans font-semibold">
                <MultiLineAddress
                  address={{
                    street: foundAddress.originalAddress.street2
                      ? `${foundAddress.originalAddress.street}<br/>${foundAddress.originalAddress.street2}`
                      : foundAddress.originalAddress.street,
                    city: foundAddress.originalAddress.city,
                    state: foundAddress.originalAddress.state,
                    zipCode: foundAddress.originalAddress.zipCode,
                  }}
                />
              </label>
            </div>
            <Button
              unstyled
              className="font-alt-sans uppercase font-semibold mt-0 mr-0"
              onClick={() => {
                setVerifyAddress(false)
              }}
            >
              {t("t.edit")}
            </Button>
          </div>
        </fieldset>
      )}
    </div>
  )
}
