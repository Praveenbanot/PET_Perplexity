export class AnalyticsService {
  aggregateSingle(mlResult) {
    // mlResult is now an array of detections
    const bottles = Array.isArray(mlResult) ? mlResult : [];
    return this.computeAnalytics(bottles);
  }

  aggregateBatch(mlResults) {
    // mlResults is an array of arrays
    const allBottles = mlResults.flat();
    return this.computeAnalytics(allBottles);
  }

  computeAnalytics(bottles) {
    const totalBottles = bottles.length;

    const classDist = this.calculateClassDistribution(bottles);
    const colorDist = this.calculateColorDistribution(bottles);
    const avgConfidence = this.calculateAvgConfidence(bottles);
    const petCount = this.calculatePetCount(bottles);
    const nonPetCount = totalBottles - petCount;
    const weightStats = this.calculateWeightStats(bottles);

    return {
      total_bottles: totalBottles,
      pet_count: petCount,
      non_pet_count: nonPetCount,
      class_distribution: classDist,
      color_distribution: colorDist,
      avg_confidence: avgConfidence,
      total_weight_g: weightStats.totalWeight,
      avg_weight_g: weightStats.avgWeight,
      avg_length_cm: weightStats.avgLength,
    };
  }

  calculateClassDistribution(bottles) {
    const dist = {};
    bottles.forEach((b) => {
      const className = b.class_name || "unknown";
      dist[className] = (dist[className] || 0) + 1;
    });
    return dist;
  }

  calculateColorDistribution(bottles) {
    const dist = {};
    bottles.forEach((b) => {
      const color = b.color || "unknown";
      dist[color] = (dist[color] || 0) + 1;
    });
    return dist;
  }

  calculatePetCount(bottles) {
    return bottles.filter((b) => b.is_pet === true).length;
  }

  calculateAvgConfidence(bottles) {
    if (bottles.length === 0) return 0;
    const sum = bottles.reduce((acc, b) => acc + (b.confidence || 0), 0);
    return parseFloat((sum / bottles.length).toFixed(4));
  }

  calculateWeightStats(bottles) {
    const bottlesWithWeight = bottles.filter(
      (b) => b.estimated_weight_g != null,
    );
    const bottlesWithLength = bottles.filter(
      (b) => b.estimated_length_cm != null,
    );

    const totalWeight = bottlesWithWeight.reduce(
      (acc, b) => acc + (b.estimated_weight_g || 0),
      0,
    );

    const avgWeight =
      bottlesWithWeight.length > 0
        ? parseFloat((totalWeight / bottlesWithWeight.length).toFixed(2))
        : 0;

    const totalLength = bottlesWithLength.reduce(
      (acc, b) => acc + (b.estimated_length_cm || 0),
      0,
    );

    const avgLength =
      bottlesWithLength.length > 0
        ? parseFloat((totalLength / bottlesWithLength.length).toFixed(2))
        : 0;

    return {
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      avgWeight,
      avgLength,
    };
  }
}
