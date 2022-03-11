#!/bin/bash

if [ -z "$1" ]; then
  cat << EOF
Usage: generate-ami-chart.sh path/to/FILE

WARNING: overwrites the file path/to/FILE.ts

This script takes a formatted text file and writes a .ts file containing the JSON representation
of the AMI chart data. It is expecting 9 columns, the first one being the AMI percentage and then
8 columns representing the income for a household with 1..8 people corresponding to that AMI. Ex:
20% 10,000 11,000 12,000 13,000 14,000 15,000 16,000 17,000
30% 15,000 16,000 17,000 18,000 19,000 20,000 21,000 22,000

This format is based on the PDF format for published MSHDA charts. Noutput ote: there must be a newline
at the end of the file or the last row will not be read in.
EOF
  exit
fi

# Get the file name and the path separately.
DIRECTORY=$(dirname "$1")
FILE=$(basename "$1")
FILENAME=${FILE%.*}
OUTPUT_FILE="$DIRECTORY/$FILENAME.ts"


echo "Generating $OUTPUT_FILE"

cat << EOF > $OUTPUT_FILE
import { AmiChartCreateDto } from "../../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

// THIS FILE WAS AUTOMATICALLY GENERATED FROM $FILE.
export const $FILENAME: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "$FILENAME",
  items: [
EOF

# For each line, generate a set of JSON values
sed -e "s/%//g" -e "s/,//g" $1 |
  while read -ra INCOME; do
    # AMI is the first column
    AMI=${INCOME[0]}
    for i in $(seq 8); do
      # print this AMI table value to the OUTPUT
      cat << EOF >> $OUTPUT_FILE
    {
      percentOfAmi: $AMI,
      householdSize: $i,
      income: ${INCOME[$i]},
    },
EOF
    done
  done

# Finish the JSON
cat << EOF >> $OUTPUT_FILE
  ],
}
EOF
