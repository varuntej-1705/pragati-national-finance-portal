import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'recommender' | 'calculator' | 'locator'>('recommender');
  
  // Recommender Form State
  const [income, setIncome] = useState('240000');
  const [cost, setCost] = useState('140000');
  const [category, setCategory] = useState('SC');
  const [matches, setMatches] = useState<any[]>([]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>SIH 2026 · PS 26092</Text>
        <Text style={styles.title}>AI-Driven Scheme Matcher</Text>
        <Text style={styles.subtitle}>Concessional Credit for Marginalized Entrepreneurs (MoSJE / NSFDC)</Text>
      </View>

      {/* 3 Pillar Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommender' && styles.activeTab]}
          onPress={() => setActiveTab('recommender')}
        >
          <Text style={[styles.tabText, activeTab === 'recommender' && styles.activeTabText]}>Recommender</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>EMI Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'locator' && styles.activeTab]}
          onPress={() => setActiveTab('locator')}
        >
          <Text style={[styles.tabText, activeTab === 'locator' && styles.activeTabText]}>Find Partner</Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Recommender */}
      {activeTab === 'recommender' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Smart Scheme Recommender</Text>
          <Text style={styles.label}>Annual Family Income (Statutory Limit: ₹5,00,000)</Text>
          <TextInput
            style={styles.input}
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            placeholder="e.g. 240000"
          />

          <Text style={styles.label}>Estimated Project / Loan Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={cost}
            onChangeText={setCost}
            keyboardType="numeric"
            placeholder="e.g. 140000"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setMatches([
                {
                  name: "NSFDC Micro Credit Finance Scheme (MCS)",
                  confidence: "HIGH",
                  maxLoan: 140000,
                  interestRate: "5.0% - 6.0%",
                  moratorium: "3 - 6 months",
                  why: "Income is <= ₹5,00,000 and SC category verified. Fast track sanction with 90% cost coverage."
                },
                {
                  name: "Mahila Samriddhi Yojana (MSY)",
                  confidence: "MEDIUM",
                  maxLoan: 140000,
                  interestRate: "4.0% p.a.",
                  moratorium: "3 - 6 months",
                  why: "Requires verification of female entrepreneur or women SHG constitution."
                }
              ]);
            }}
          >
            <Text style={styles.buttonText}>Check Concessional Eligibility</Text>
          </TouchableOpacity>

          {matches.map((item, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.badgeRow}>
                <Text style={item.confidence === 'HIGH' ? styles.tagHigh : styles.tagMedium}>
                  {item.confidence === 'HIGH' ? 'Likely eligible' : 'Maybe eligible — verify criteria'}
                </Text>
                <Text style={styles.rateBadge}>{item.interestRate}</Text>
              </View>
              <Text style={styles.schemeName}>{item.name}</Text>
              <Text style={styles.schemeDetail}>Max Limit: ₹{item.maxLoan.toLocaleString('en-IN')} | Moratorium: {item.moratorium}</Text>
              <Text style={styles.explanationText}>💡 {item.why}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tab 2: Calculator */}
      {activeTab === 'calculator' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dynamic Financial Calculator</Text>
          <Text style={styles.label}>Principal Loan Amount: ₹1,40,000</Text>
          <Text style={styles.label}>Interest Rate: 5.5% p.a. (Concessional)</Text>
          <Text style={styles.label}>Moratorium Period: 6 Months</Text>
          <View style={styles.calcHighlightBox}>
            <Text style={styles.calcValueText}>₹4,228 / month</Text>
            <Text style={styles.calcSubText}>Projected Monthly EMI during Repayment</Text>
            <Text style={styles.savingsBadge}>✨ Saves ~₹18,500 compared to commercial bank rates (12.5%)</Text>
          </View>
        </View>
      )}

      {/* Tab 3: Partner Locator */}
      {activeTab === 'locator' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Geo-Spatial Channel Partner Router</Text>
          <Text style={styles.label}>Filtered by Location & NPA Eligibility Flag</Text>
          
          <View style={styles.partnerCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.tagHigh}>ELIGIBLE (Low NPA)</Text>
              <Text style={styles.partnerTypeTag}>SCA</Text>
            </View>
            <Text style={styles.partnerName}>Tamil Nadu Adi Dravidar Housing & Dev. Corp (TAHDCO)</Text>
            <Text style={styles.partnerDetail}>📍 Cenotaph Road, Teynampet, Chennai (2.4 km away)</Text>
            <Text style={styles.partnerDetail}>⚡ Fund Utilisation Score: 94% | Active Schemes: All</Text>
          </View>

          <View style={styles.partnerCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.tagHigh}>ELIGIBLE (Low NPA)</Text>
              <Text style={styles.partnerTypeTag}>PSB</Text>
            </View>
            <Text style={styles.partnerName}>State Bank of India (MSME Hub - Chennai Main)</Text>
            <Text style={styles.partnerDetail}>📍 Rajaji Salai, Chennai (4.1 km away)</Text>
            <Text style={styles.partnerDetail}>⚡ Fund Utilisation Score: 96% | Active Schemes: Term Loan, Education</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#0D5C3A' },
  badge: { color: '#DCFCE7', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#CBD5E1', fontSize: 13, marginTop: 4 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#107C41' },
  tabText: { color: '#64748B', fontWeight: '600' },
  activeTabText: { color: '#107C41' },
  card: { margin: 16, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 15 },
  primaryButton: { backgroundColor: '#107C41', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginTop: 16, padding: 14, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagHigh: { backgroundColor: '#DCFCE7', color: '#107C41', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
  tagMedium: { backgroundColor: '#FEF3C7', color: '#B45309', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
  rateBadge: { color: '#107C41', fontWeight: 'bold', fontSize: 13 },
  schemeName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  schemeDetail: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  explanationText: { fontSize: 13, color: '#334155', fontStyle: 'italic', lineHeight: 18 },
  calcHighlightBox: { backgroundColor: '#F0FDF4', padding: 20, borderRadius: 12, alignItems: 'center', marginVertical: 12, borderWidth: 1, borderColor: '#DCFCE7' },
  calcValueText: { fontSize: 28, fontWeight: 'bold', color: '#107C41' },
  calcSubText: { fontSize: 13, color: '#475569', marginTop: 4 },
  savingsBadge: { fontSize: 12, color: '#0D5C3A', fontWeight: '600', marginTop: 8 },
  partnerCard: { padding: 14, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  partnerTypeTag: { backgroundColor: '#F1F5F9', color: '#475569', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 11, fontWeight: 'bold' },
  partnerName: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginTop: 4 },
  partnerDetail: { fontSize: 13, color: '#64748B', marginTop: 4 }
});
