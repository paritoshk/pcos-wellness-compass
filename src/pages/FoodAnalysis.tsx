import React, { useState, useRef } from 'react';
import { Button, Card, Progress, Container, Stack, Group, Box, Text, Title, Grid, Image, Center, Loader, List } from "@mantine/core";
import { IconCamera, IconToolsKitchen2, IconMessageCircle2, IconTrash, IconCircleCheck } from "@tabler/icons-react";
import { notifications } from '@mantine/notifications';
import { useUser, FoodAnalysisItem } from '@/contexts/UserContext';
import { FireworksAIService } from '@/services/fireworksAI';
import { useNavigate } from 'react-router-dom';

interface FoodAnalysisResult {
  foodName: string;
  pcosCompatibility: number;
  nutritionalInfo: { carbs: number; protein: number; fats: number; glycemicLoad: string; inflammatoryScore: string; };
  recommendation: string;
  alternatives: string[];
}

const FoodAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, addFoodAnalysis } = useUser();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      notifications.show({ title: "File too large", message: "Please select an image under 5MB.", color: "red" });
      return;
    }
    if (!file.type.startsWith('image/')) {
      notifications.show({ title: "Invalid file type", message: "Please select an image file.", color: "red" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeFood = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const fireworksService = new FireworksAIService();
      const result = await fireworksService.analyzeFoodImage(image, profile);
      if (result && result.foodName && result.foodName.toLowerCase() !== 'unknown') {
        const analysisItem: FoodAnalysisItem = { id: crypto.randomUUID(), date: new Date().toISOString(), imageUrl: image, ...result };
        addFoodAnalysis(analysisItem);
        setAnalysisResult(result);
        notifications.show({ title: "Analysis Complete", message: `Successfully analyzed ${result.foodName}.`, color: "green", icon: <IconCircleCheck /> });
      } else {
        throw new Error("Could not identify the food in the image. Please try a clearer picture.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      notifications.show({ title: "Analysis Failed", message: errorMessage, color: "red" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const shareWithChat = () => {
    if (!analysisResult || !image) return;
    navigate('/chat', { state: { foodAnalysis: { ...analysisResult, imageUrl: image, id: crypto.randomUUID(), date: new Date().toISOString() } } });
  };

  return (
    <Container size="md" p="md">
      <Stack gap="xl">
        <Box>
          <Title order={1} mb="xs">Analyze Your Food</Title>
          <Text c="dimmed">Get instant feedback on meals by uploading a photo.</Text>
        </Box>
        
        {!analysisResult && (
          <Card withBorder padding="xl" radius="md">
            <Stack align="center" gap="lg">
              {image ? (
                <>
                  <Image radius="md" src={image} alt="Food to analyze" maw={300} />
                  <Group>
                    <Button variant="default" onClick={clearImage} leftSection={<IconTrash size={16} />}>Remove</Button>
                    <Button onClick={analyzeFood} loading={isAnalyzing} loaderProps={{type: 'dots'}} leftSection={<IconToolsKitchen2 size={16} />}>Analyze Food</Button>
                  </Group>
                </>
              ) : (
                <>
                  <Center style={{width: '100%', height: 200, border: '2px dashed var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)', flexDirection:'column'}}>
                    <IconCamera size={48} stroke={1.5} color="var(--mantine-color-gray-5)" />
                    <Text mt="sm" c="dimmed">Upload a photo</Text>
                  </Center>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button onClick={() => fileInputRef.current?.click()} variant="light" color="pink" size="md">Select Image</Button>
                </>
              )}
            </Stack>
          </Card>
        )}
        
        {isAnalyzing && !analysisResult && <Center p="xl"><Loader color="pink" /> <Text ml="md">Analyzing...</Text></Center>}

        {analysisResult && image && (
          <Card withBorder padding="xl" radius="md">
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack>
                  <Image radius="md" src={image} alt={analysisResult.foodName} />
                  <Title order={3}>{analysisResult.foodName}</Title>
                  <Button onClick={clearImage} variant="light" color="pink">Analyze Another Food</Button>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <Box>
                    <Group justify="space-between" mb="xs"><Text>PCOS Compatibility</Text><Text fw={600}>{analysisResult.pcosCompatibility}%</Text></Group>
                    <Progress value={analysisResult.pcosCompatibility} color={analysisResult.pcosCompatibility > 70 ? "green" : analysisResult.pcosCompatibility > 40 ? "yellow" : "red"} size="lg" radius="md" />
                  </Box>
                  <Grid>
                    <Grid.Col span={4}><Card withBorder ta="center"><Text size="sm" c="dimmed">Carbs</Text><Text fw={600}>{analysisResult.nutritionalInfo.carbs}g</Text></Card></Grid.Col>
                    <Grid.Col span={4}><Card withBorder ta="center"><Text size="sm" c="dimmed">Protein</Text><Text fw={600}>{analysisResult.nutritionalInfo.protein}g</Text></Card></Grid.Col>
                    <Grid.Col span={4}><Card withBorder ta="center"><Text size="sm" c="dimmed">Fats</Text><Text fw={600}>{analysisResult.nutritionalInfo.fats}g</Text></Card></Grid.Col>
                  </Grid>
                  <Stack gap="xs"><Title order={5}>Recommendation</Title><Text size="sm">{analysisResult.recommendation}</Text></Stack>
                  {analysisResult.alternatives.length > 0 && (
                    <Stack gap="xs">
                      <Title order={5}>Healthier Alternatives</Title>
                      <List size="sm" icon={<IconCircleCheck color="var(--mantine-color-green-6)" size={16} />}>
                        {analysisResult.alternatives.map((alt, i) => <List.Item key={i}>{alt}</List.Item>)}
                      </List>
                    </Stack>
                  )}
                  <Button onClick={shareWithChat} leftSection={<IconMessageCircle2 size={16} />} fullWidth mt="md">Discuss with Nari</Button>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default FoodAnalysis;
