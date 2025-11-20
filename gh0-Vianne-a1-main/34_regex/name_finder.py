import re

# Define the regex pattern for name-like formats
name_pattern = r'(((Mrs\.|Dr\.|Mr\.|Ms\.|Ms|Mr|Mrs|Dr|mr|mrs|dr|ms) )(([A-Z]\.|[A-Z][a-z]+(\-[a-z]+)?)) ?(([A-Z]\.|[A-Z][a-z]+(\-[a-z]+)?))?)'

# Function to read lines from a file
def read_names_from_file(file_path):
    """Reads lines from an input file."""
    try:
        with open(file_path, 'r') as file:
            return file.readlines()
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return []
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return []

# Main function
def main(input_file_path, output_file_path):
    lines = read_names_from_file(input_file_path)
    
    if not lines:
        print("No lines to process. Check the input file.")
        return
    
    unique_names = set()  
    
    try:
        # Write results to a file
        with open(output_file_path, 'w') as output_file:
            for line_num, line in enumerate(lines, start=1):
                matches = re.findall(name_pattern, line)
                line_unique_names = {match for group in matches for match in group if match}
                
                # Add the current line's unique names to the overall set
                unique_names.update(line_unique_names)
                
                line_output = f"Line {line_num}: {', '.join(line_unique_names) if line_unique_names else '0 names'}\n"
                print(line_output)
                output_file.write(line_output)
            
            # Write total unique names
            total_count_output = f"\nTotal unique names processed: {len(unique_names)}\n"
            print(total_count_output)
            output_file.write(total_count_output)

        print(f"\nResults successfully written to '{output_file_path}'.")
    
    except Exception as e:
        print(f"An error occurred: {e}")


input_file_path = "text1.txt"  
output_file_path = "filtered_names.txt"  
main(input_file_path, output_file_path)