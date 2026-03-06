# Advanced simulation logic
# simulation_engine.py - Advanced simulation logic
import numpy as np
import random
from datetime import datetime, timedelta

class HybridVehicleSimulator:
    def __init__(self):
        self.battery_capacity = 100  # kWh
        self.current_battery = 75    # %
        self.current_speed = 0       # km/h
        self.current_acceleration = 0 # %
        self.current_mode = 'electric'
        self.total_distance = 0      # km
        self.total_fuel_used = 0     # liters
        self.total_energy_used = 0   # kWh
        
    def simulate_trip(self, duration_minutes=60, time_interval=1):
        """Simulate a complete trip with realistic driving patterns"""
        results = []
        time_steps = int(duration_minutes / time_interval)
        
        for step in range(time_steps):
            # Simulate realistic driving conditions
            self.update_driving_conditions()
            
            # Determine optimal mode
            mode = self.determine_optimal_mode()
            
            # Calculate energy consumption
            energy_consumed = self.calculate_energy_consumption()
            
            # Update vehicle state
            self.update_vehicle_state(energy_consumed)
            
            # Record results
            result = {
                'timestamp': datetime.now() + timedelta(minutes=step * time_interval),
                'battery_level': self.current_battery,
                'speed': self.current_speed,
                'acceleration': self.current_acceleration,
                'mode': mode,
                'efficiency': self.calculate_efficiency(),
                'distance_traveled': self.total_distance,
                'energy_consumed': energy_consumed
            }
            results.append(result)
            
        return results
    
    def update_driving_conditions(self):
        """Update driving conditions based on realistic patterns"""
        # Simulate speed variations (city driving pattern)
        if random.random() < 0.3:  # 30% chance of speed change
            speed_change = random.uniform(-20, 20)
            self.current_speed = max(0, min(120, self.current_speed + speed_change))
        
        # Simulate acceleration based on speed
        if self.current_speed < 30:
            self.current_acceleration = random.uniform(0, 60)
        elif self.current_speed < 70:
            self.current_acceleration = random.uniform(-20, 40)
        else:
            self.current_acceleration = random.uniform(-30, 20)
        
        # Battery naturally drains slightly
        self.current_battery -= random.uniform(0.1, 0.5)
        self.current_battery = max(0, self.current_battery)
    
    def determine_optimal_mode(self):
        """Determine the optimal operating mode based on current conditions"""
        if self.current_battery > 70 and self.current_speed < 60 and self.current_acceleration < 50:
            return 'electric'
        elif self.current_battery > 30 and self.current_speed < 100:
            return 'hybrid'
        else:
            return 'engine'
    
    def calculate_energy_consumption(self):
        """Calculate energy consumption based on current mode and conditions"""
        base_consumption = 0.15  # kWh per km
        
        # Adjust based on mode
        if self.current_mode == 'electric':
            consumption = base_consumption * 0.8
        elif self.current_mode == 'hybrid':
            consumption = base_consumption * 1.2
        else:  # engine
            consumption = base_consumption * 2.0
        
        # Adjust based on speed and acceleration
        speed_factor = 1 + (self.current_speed / 100) * 0.5
        accel_factor = 1 + (self.current_acceleration / 100) * 0.8
        
        return consumption * speed_factor * accel_factor
    
    def update_vehicle_state(self, energy_consumed):
        """Update the vehicle state after each time step"""
        self.total_energy_used += energy_consumed
        
        # Update battery level
        if self.current_mode == 'electric':
            self.current_battery -= energy_consumed * 0.5
        elif self.current_mode == 'hybrid':
            self.current_battery -= energy_consumed * 0.2
        
        # Update distance (assuming average speed for the time interval)
        distance = (self.current_speed / 60) * 1  # km per minute
        self.total_distance += distance
    
    def calculate_efficiency(self):
        """Calculate current efficiency based on mode and conditions"""
        base_efficiency = {
            'electric': 95,
            'hybrid': 75,
            'engine': 35
        }
        
        efficiency = base_efficiency.get(self.current_mode, 50)
        
        # Adjust based on conditions
        if self.current_speed > 80:
            efficiency -= 10
        if self.current_acceleration > 70:
            efficiency -= 15
        if self.current_battery < 20:
            efficiency -= 20
        
        return max(0, min(100, efficiency))

# Example usage
if __name__ == "__main__":
    simulator = HybridVehicleSimulator()
    trip_results = simulator.simulate_trip(duration_minutes=30)
    
    for result in trip_results[-5:]:  # Show last 5 results
        print(f"Time: {result['timestamp'].strftime('%H:%M:%S')}, "
              f"Mode: {result['mode']}, "
              f"Battery: {result['battery_level']:.1f}%, "
              f"Speed: {result['speed']:.0f} km/h, "
              f"Efficiency: {result['efficiency']:.0f}%")