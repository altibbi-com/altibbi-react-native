import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { AppHeader } from '../component/appHeader';
import { AppCard } from '../component/appCard';
import { colors } from '../theme/colors';

const ConsultationDetails = (props: any) => {
  const { data } = props.route.params;

  const DetailItem = ({ label, value, color = colors.text }: any) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value || 'N/A'}</Text>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'closed':
        return colors.gray;
      default:
        return colors.text;
    }
  };

  const renderRecommendation = () => {
    const recommendation = data.recommendation;
    if (!recommendation || !recommendation.data) return null;

    const { drug, lab, icd10, followUp, doctorReferral, postCallAnswer } = recommendation.data;

    return (
      <AppCard>
        <Text style={styles.sectionTitle}>Recommendation</Text>

        {(icd10?.diagnosis?.length > 0 || icd10?.symptom?.length > 0) && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Diagnosis & Symptoms</Text>
            {icd10?.diagnosis?.map((d: any, i: number) => (
              <DetailItem key={`diag-${i}`} label="Diagnosis" value={`${d.name} (${d.code})`} />
            ))}
            {icd10?.symptom?.map((s: any, i: number) => (
              <DetailItem key={`symp-${i}`} label="Symptom" value={`${s.name} (${s.code})`} />
            ))}
          </View>
        )}

        {drug?.fdaDrug?.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Medications</Text>
            {drug?.fdaDrug?.map((d: any, i: number) => (
              <View key={`drug-${i}`} style={styles.recommendationBlock}>
                <Text style={styles.recommendationSubTitle}>{d.name} {d.tradeName ? `(${d.tradeName})` : ''}</Text>
                <View style={styles.gridContainer}>
                  <View style={styles.gridItem}><Text style={styles.recommendationLabel}>Dosage:</Text><Text style={styles.recommendationValue}>{d.dosage}</Text></View>
                  <View style={styles.gridItem}><Text style={styles.recommendationLabel}>Frequency:</Text><Text style={styles.recommendationValue}>{d.frequency}</Text></View>
                  <View style={styles.gridItem}><Text style={styles.recommendationLabel}>Duration:</Text><Text style={styles.recommendationValue}>{d.duration} days</Text></View>
                  <View style={styles.gridItem}><Text style={styles.recommendationLabel}>Route:</Text><Text style={styles.recommendationValue}>{d.routeOfAdministration}</Text></View>
                </View>
                {d.howToUse && <Text style={styles.recommendationText}><Text style={styles.bold}>How to use: </Text>{d.howToUse}</Text>}
                {d.relationWithFood && <Text style={styles.recommendationText}><Text style={styles.bold}>Food Relation: </Text>{d.relationWithFood}</Text>}
                {d.specialInstructions && <Text style={styles.recommendationText}><Text style={styles.bold}>Instructions: </Text>{d.specialInstructions}</Text>}
              </View>
            ))}
          </View>
        )}

        {(lab?.lab?.length > 0 || lab?.panel?.length > 0) && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Laboratory Tests</Text>
            {lab?.lab?.map((l: any, i: number) => (
              <DetailItem key={`lab-${i}`} label="Lab Test" value={l.name} />
            ))}
            {lab?.panel?.map((p: any, i: number) => (
              <DetailItem key={`panel-${i}`} label="Panel" value={p.name} />
            ))}
          </View>
        )}

        {followUp?.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Follow Up</Text>
            {followUp?.map((f: any, i: number) => (
              <DetailItem key={`follow-${i}`} label="Instruction" value={f.name} />
            ))}
          </View>
        )}

        {doctorReferral && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Referral</Text>
            <DetailItem label="Specialist" value={doctorReferral.name} />
          </View>
        )}

      </AppCard>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Consultation Details"
        subtitle={`ID: ${data.id}`}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard>
          <Text style={styles.sectionTitle}>General Information</Text>
          <DetailItem
            label="Status"
            value={data.status?.toUpperCase()}
            color={getStatusColor(data.status)}
          />
          <DetailItem label="Medium" value={data.medium?.toUpperCase()} />
          <DetailItem label="Created At" value={data.created_at} />
          <DetailItem label="Closed At" value={data.closed_at} />
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Question</Text>
          <Text style={styles.questionText}>{data.question}</Text>
        </AppCard>

        {data.user && (
          <AppCard>
            <Text style={styles.sectionTitle}>User Information</Text>
            <DetailItem label="Name" value={data.user.name} />
            <DetailItem label="Phone" value={data.user.phone_number} />
            <DetailItem label="Gender" value={data.user.gender} />
            <DetailItem label="Date of Birth" value={data.user.date_of_birth} />
            <DetailItem label="Insurance ID" value={data.user.insurance_id} />
            <DetailItem label="Policy Number" value={data.user.policy_number} />
          </AppCard>
        )}

        {renderRecommendation()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  subSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
    paddingBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  questionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  recommendationBlock: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  recommendationSubTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  gridItem: {
    width: '50%',
    marginBottom: 8,
  },
  recommendationLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recommendationValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  recommendationText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
    color: colors.gray,
  },
  qaBlock: {
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default ConsultationDetails;
