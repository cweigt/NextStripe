import React from 'react';
import { Text, View } from 'react-native';
import Star from './Star';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  showRating?: boolean;
}

const StarRating = ({ 
  rating, 
  maxRating = 10, //this is where to change how many stars apepar
  starSize = 16, 
  showRating = true 
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Full stars */}
      {Array.from({ length: fullStars }, (_, index) => (
        <Star key={`full-${index}`} size={starSize} color="#FFD700" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <View style={{ position: 'relative' }}>
          <Star size={starSize} color="#E0E0E0" />
          <View style={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            width: starSize / 2, 
            overflow: 'hidden' 
          }}>
            <Star size={starSize} color="#FFD700" />
          </View>
        </View>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }, (_, index) => (
        <Star key={`empty-${index}`} size={starSize} color="#E0E0E0" />
      ))}
      
      {/* Show rating number */}
      {showRating && (
        <View style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 14, color: '#666' }}>{rating}</Text>
        </View>
      )}
    </View>
  );
};

export default StarRating;
