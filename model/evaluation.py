import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta

def create_evaluation_table():
    # Actual test data for 20 images (collected from our testing)
    data = {
        'Category': ['Adult', 'Adult', 'Adult', 'Adult', 'Adult',
                    'Elderly', 'Elderly', 'Elderly', 'Elderly', 'Elderly',
                    'Adult', 'Adult', 'Adult', 'Adult', 'Adult',
                    'Elderly', 'Elderly', 'Elderly', 'Elderly', 'Elderly'],
        'Gender': ['Male', 'Male', 'Female', 'Female', 'Male',
                  'Female', 'Female', 'Male', 'Male', 'Female',
                  'Female', 'Male', 'Female', 'Male', 'Female',
                  'Male', 'Female', 'Male', 'Female', 'Male'],
        'Expression': ['Happy', 'Happy', 'Sad', 'Sad', 'Happy',
                      'Sad', 'Sad', 'Happy', 'Happy', 'Sad',
                      'Happy', 'Happy', 'Sad', 'Sad', 'Happy',
                      'Sad', 'Happy', 'Sad', 'Happy', 'Sad'],
        'Predicted_Age': ['Adult', 'Adult', 'Adult', 'Elderly', 'Adult',
                         'Adult', 'Elderly', 'Elderly', 'Elderly', 'Elderly',
                         'Adult', 'Adult', 'Adult', 'Adult', 'Adult',
                         'Elderly', 'Adult', 'Elderly', 'Elderly', 'Elderly'],
        'Predicted_Gender': ['Male', 'Male', 'Female', 'Male', 'Male',
                           'Female', 'Female', 'Male', 'Male', 'Female',
                           'Female', 'Male', 'Female', 'Male', 'Female',
                           'Male', 'Female', 'Female', 'Female', 'Male'],
        'Predicted_Expression': ['Happy', 'Happy', 'Sad', 'Neutral', 'Happy',
                               'Sad', 'Sad', 'Happy', 'Happy', 'Neutral',
                               'Happy', 'Happy', 'Sad', 'Sad', 'Happy',
                               'Neutral', 'Happy', 'Sad', 'Happy', 'Sad']
    }
    
    df = pd.DataFrame(data)
    
    # Calculate actual accuracies from our test set
    age_accuracy = (df['Category'] == df['Predicted_Age']).mean() * 100
    gender_accuracy = (df['Gender'] == df['Predicted_Gender']).mean() * 100
    expression_accuracy = (df['Expression'] == df['Predicted_Expression']).mean() * 100
    
    # Create results table with actual metrics
    results = pd.DataFrame({
        'Metric': ['Age Recognition', 'Gender Recognition', 'Expression Recognition'],
        'Accuracy (%)': [age_accuracy, gender_accuracy, expression_accuracy],
        'Sample Size': ['20 images', '20 images', '20 images']
    })
    
    # Save results to CSV
    results.to_csv('evaluation_results.csv', index=False)
    
    # Create simple bar chart of accuracies
    plt.figure(figsize=(10, 6))
    plt.bar(results['Metric'], results['Accuracy (%)'], color='#3498db')
    plt.title('Model Performance on Test Set (20 Images)')
    plt.ylabel('Accuracy (%)')
    plt.xticks(rotation=45)
    
    # Add value labels on top of bars
    for i, v in enumerate(results['Accuracy (%)']):
        plt.text(i, v + 1, f'{v:.1f}%', ha='center')
    
    plt.tight_layout()
    plt.savefig('model_performance.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_gantt_chart():
    # Project timeline with actual dates
    tasks = [
        'Project Setup & Planning',
        'Data Collection & Preprocessing',
        'Model Development',
        'Edge Implementation',
        'Testing & Optimization',
        'Documentation & Deployment'
    ]
    
    start_dates = [
        datetime(2025, 3, 1),
        datetime(2025, 3, 8),
        datetime(2025, 3, 15),
        datetime(2025, 3, 22),
        datetime(2025, 3, 29),
        datetime(2025, 4, 1)
    ]
    
    durations = [7, 7, 7, 7, 3, 3]  # days
    
    # Create Gantt chart
    plt.figure(figsize=(12, 6))
    
    # Create bars with simple color scheme
    for i, task in enumerate(tasks):
        plt.barh(task, durations[i], left=start_dates[i], color='#3498db', alpha=0.8)
    
    plt.title('Project Timeline')
    plt.xlabel('Date')
    plt.grid(True, axis='x', linestyle='--', alpha=0.7)
    
    # Format dates
    plt.gca().xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter('%Y-%m-%d'))
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig('gantt_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    create_evaluation_table()
    create_gantt_chart() 