<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- Change the following line to read select="false()" if you want users to be able to submit requests on an individual item level
		 in addition to being able to submit them on the top-most container level. -->
  <xsl:variable name="topLevelRequestsOnly" select="true()"/>

  <xsl:template match="/">
    <xsl:element name="div">
      <!-- eadCommon Div -->
      <xsl:attribute name="id">eadCommon</xsl:attribute>
      <a name="title"/>

      <!-- Display the Finding Aid title -->
      <xsl:choose>
        <xsl:when test="ead/eadheader/filedesc/titlestmt/titleproper">
          <h2>
            <xsl:value-of select="ead/eadheader/filedesc/titlestmt/titleproper"/>
            <xsl:value-of select="ead/eadheader/filedesc/titlestmt/subtitle"/>
          </h2>
        </xsl:when>
        <xsl:otherwise>
          <h2>[No Title]</h2>
        </xsl:otherwise>
      </xsl:choose>

      <!-- Select Collection Title and place in ItemTitle field -->
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">ItemTitle</xsl:attribute>
        <xsl:attribute name="name">FormDataField</xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="normalize-space(ead/archdesc/did/unittitle)"/>
        </xsl:attribute>
      </xsl:element>


      <!-- Select Finding Aid ID and place in EADNumber field -->
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">EADNumber</xsl:attribute>
        <xsl:attribute name="name">FormDataField</xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="normalize-space(ead/eadheader/eadid)"/>
        </xsl:attribute>
      </xsl:element>

      <!-- Define example behavior for adding field mapping so that the volume information for grouped EAD requests is concatenated into the ItemVolume field. Possible options for the value are: Concatenate, AddNote or FirstValue-->
      <!--
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">GroupingOption_ItemVolume</xsl:attribute>
        <xsl:attribute name="name">FormDataField</xsl:attribute>
        <xsl:attribute name="value">Concatenate</xsl:attribute>
      </xsl:element>
      -->

      <!-- The following is an example of how to define a GroupingIdentifier element that will determine what form field is used to identify which requests 
           should be grouped into a single Aeon transaction.  The grouping field does NOT need to be an Aeon transaction.-->
      <!--
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">GroupingIdentifier</xsl:attribute>
        <xsl:attribute name="name">FormDataField</xsl:attribute>
        <xsl:attribute name="value">GroupingField</xsl:attribute>
      </xsl:element>
      -->

      <!-- Apply template to format output -->
      <xsl:apply-templates select="ead/archdesc/descgrp"/>


    </xsl:element>
    <!-- End of eadCommon div -->

    <!-- Add Container List heading and explanatory note -->
    <!-- 20090624 - Genie at Atlas changed from Container list to Inventory -->

    <h4>Inventory</h4>
    <span class="field">
      <span class="note">Click on any headings below to display/hide corresponding series or subseries listing. Click associated checkboxes to select items to request. When you have finished, click the Submit Request button at the bottom of the page.</span>
    </span>

    <xsl:apply-templates select="ead/archdesc/dsc"/>

  </xsl:template>

  <!-- This section selects desired sections from the descgrp element for display in the EAD header -->
  <xsl:template match="ead/archdesc/descgrp">
    <xsl:apply-templates select="accessrestrict">
      <xsl:with-param name="defaultHeader">Access Restrictions</xsl:with-param>
    </xsl:apply-templates>

    <xsl:apply-templates select="userestrict">
      <xsl:with-param name="defaultHeader">Use Restrictions</xsl:with-param>

    </xsl:apply-templates>

    <xsl:apply-templates select="prefercite">
      <xsl:with-param name="defaultHeader">Preferred Citation</xsl:with-param>
    </xsl:apply-templates>

    <xsl:apply-templates select="scopecontent">
      <xsl:with-param name="defaultHeader">Scope and Content</xsl:with-param>
      <xsl:with-param name="hideByDefault">1</xsl:with-param>
    </xsl:apply-templates>

  </xsl:template>

  <!-- This template handles outputting general collection information from the descgrp section of the EAD -->
  <xsl:template match="accessrestrict|userestrict|prefercite|scopecontent">
    <xsl:param name="defaultHeader"/>
    <xsl:param name="hideByDefault">0</xsl:param>

    <!-- Print out the header -->
    <xsl:variable name="headerDivID">
      <xsl:text>HeaderItem_</xsl:text>
      <xsl:for-each select="ancestor-or-self::*">
        <xsl:value-of select="name()"/>
        <xsl:text>_</xsl:text>
      </xsl:for-each>
      <xsl:value-of select="position()"/>
    </xsl:variable>

    <xsl:element name="h4">
      <xsl:attribute name="onclick">
        <xsl:text>$('#</xsl:text>
        <xsl:value-of select="normalize-space($headerDivID)"/>
        <xsl:text>').toggle();</xsl:text>
      </xsl:attribute>
      <xsl:attribute name="style">
        cursor:pointer;
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="head">
          <xsl:value-of select="normalize-space(head)"/>
        </xsl:when>

        <xsl:otherwise>
          <xsl:value-of select="$defaultHeader"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>

    <!-- Print out the text -->
    <xsl:element name="div">
      <xsl:attribute name="ID">
        <xsl:value-of select="normalize-space($headerDivID)"/>

      </xsl:attribute>
      <xsl:attribute name="style">
        <xsl:choose>
          <xsl:when test="$hideByDefault='1'">
            <xsl:text>display:none;</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text>display:visible</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>

      <xsl:choose>
        <xsl:when test="p">
          <xsl:value-of select="normalize-space(p)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>[Not specified]</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>

  </xsl:template>

  <xsl:template match="dsc">
    <xsl:choose>
      <xsl:when test="c/did/container | c01/did/container">
        <!-- The base c/c0# group consists of items, so we just have to process them. -->
        <xsl:element name="div">
          <xsl:attribute name="class">EADGroup</xsl:attribute>
          <xsl:call-template name="processItemGroup">
            <xsl:with-param name="seriesID" select="'1-'"/>
            <xsl:with-param name="itemComponentList" select="c|c01"/>
          </xsl:call-template>
        </xsl:element>

      </xsl:when>
      <xsl:otherwise>
        <!-- The base group consists of sections, so we need to process the sections down to the item level. -->
        <xsl:apply-templates select="c|c01">
          <xsl:with-param name="currentDepth" select="1"/>
        </xsl:apply-templates>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="sectionInfo" match="c|c01|c02|c03|c04|c05|c06|c07|c08|c09|c10|c11|c12">
    <xsl:param name="currentDepth"></xsl:param>
    <xsl:param name="parentID"></xsl:param>
    <!-- If this node has a parent container, that parent should have appended the '-' to its ID before passing it, so there is no need for us to do so here and worry about having an id of '-#' for top level containers.-->
    <xsl:variable name="currentID" select="concat($parentID,string(position()))"/>
    <!-- Create next depth string. We need to prepend a zero to single digit depths, but won't know whether we are dealing with a single or double digit depth.-->
    <!-- Due to the declarative nature of xslt, we are forced to do this in a slightly clunky manner, but it works well and is cleaner than the standard alternatives for xslt. -->
    <xsl:variable name="nextDepthStringWithZero" select="concat('0', string(number($currentDepth) + number(1)))"/>
    <xsl:variable name="nextDepthNodeName" select="concat('c', substring($nextDepthStringWithZero, string-length($nextDepthStringWithZero) - 2))"/>

    <!-- Start of EAD Section Div -->
    <xsl:element name="div">
      <xsl:attribute name="class">EADSection</xsl:attribute>
      <xsl:element name="a">
        <xsl:attribute name="style">text-decoration:underline</xsl:attribute>
        <xsl:attribute name="onclick">
          <xsl:text>$('#</xsl:text>
          <xsl:value-of select="concat('EADGroup', $currentID)"/>
          <xsl:text>').toggle();</xsl:text>
        </xsl:attribute>
        <xsl:attribute name="title">Expand/Collapse</xsl:attribute>
        <xsl:choose>
          <xsl:when test="did/unittitle">
            <xsl:value-of select="did/unittitle"/>
          </xsl:when>
          <xsl:when test="did/head">
            <xsl:value-of select="did/head"/>
          </xsl:when>
          <xsl:when test="head">
            <xsl:value-of select="head"/>

          </xsl:when>
          <xsl:otherwise>
            <xsl:text>Unspecified</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:element>

      <a href="#title" class="toplink">[Top]</a>
      <br/>

      <!-- Start of EADGroup Div -->
      <xsl:element name="div">
        <xsl:attribute name="id">
          <xsl:value-of select="concat('EADGroup', $currentID)"/>
        </xsl:attribute>
        <xsl:attribute name="class">EADGroup</xsl:attribute>
        <xsl:attribute name="style">display:none;</xsl:attribute>
        <!-- Parse the next level child nodes, if any -->
        <xsl:choose>
          <xsl:when test="child::node()[name() = $nextDepthNodeName]/did/container | child::node()[name() = 'c']/did/container">
            <!-- This node's children are item nodes.  Parse them as items. -->
            <xsl:call-template name="processItemGroup">
              <xsl:with-param name="seriesID" select="concat(string($currentID), '-')"/>
              <xsl:with-param name="itemComponentList" select="child::*[name() = $nextDepthNodeName] | child::*[name() = 'c']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <!-- Any child components are section components because none of them have containers. -->
            <xsl:apply-templates select="child::node()[name() = $nextDepthNodeName] | child::node()[name() = 'c']">
              <xsl:with-param name="currentDepth" select="$currentDepth + 1"/>
              <xsl:with-param name="parentID" select="concat(string($currentID), '-')"/>
            </xsl:apply-templates>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:element>
      <!-- End of EADGroup Div -->
    </xsl:element>
    <!-- End of EAD Section Div -->
  </xsl:template>

  <xsl:template name="processItemGroup">
    <xsl:param name="itemComponentList"/>
    <xsl:param name="seriesID"/>
    <xsl:param name="containerPosition" select="1"/>
    <xsl:param name="itemIDStart" select="1"/>


    <!-- Build list of items that go to this group -->
    <xsl:variable name="referenceItem" select="$itemComponentList[count(did/container) >= $containerPosition and did/container[1]/@type != ''][1]"/>

    <xsl:variable name="containerType" select="translate($referenceItem/did/container[$containerPosition]/@type, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
    <xsl:variable name="containerNumber" select="$referenceItem/did/container[$containerPosition]"/>

    <xsl:variable name="itemGroup" select="$itemComponentList[translate(did/container[$containerPosition]/@type, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = $containerType and did/container[$containerPosition] = $containerNumber]"/>

    <!-- Build list of items that go to a different group -->

    <xsl:variable name="itemsRemainingToBeGrouped" select="$itemComponentList[count(did/container) >= $containerPosition and did/container[$containerPosition]/@type != '' and not(translate(did/container[$containerPosition]/@type, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = $containerType and did/container[$containerPosition] = $containerNumber)]"/>

    <!-- Build list of items at this level that are not in a group -->
    <xsl:variable name="floatingItems" select="$itemComponentList[count(did/container) = $containerPosition - 1 or not(did/container[$containerPosition]/@type) or did/container[$containerPosition]/@type = '']"/>

    <xsl:if test="$referenceItem and count($itemGroup) > 0">
      <!-- Define some string variables we will need to output the group -->
      <xsl:variable name="containerTypeOutput" select="concat(translate(substring($containerType, 1,1), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), substring($containerType, 2))"/>

      <xsl:variable name="containerIDString">
        <xsl:value-of select="$seriesID"/>
        <xsl:for-each select="$referenceItem/did/container[$containerPosition >= position()]">
          <xsl:value-of select="concat(@type,.)"/>
          <xsl:if test="last() > position()">
            <xsl:text>_</xsl:text>
          </xsl:if>
        </xsl:for-each>
      </xsl:variable>

      <xsl:variable name="containerSubLocation">
        <xsl:for-each select="$referenceItem/did/container[$containerPosition >= position()]">
          <xsl:value-of select="concat(@type, ': ', .)"/>
          <xsl:if test="last() > position()">
            <xsl:text>; </xsl:text>
          </xsl:if>
        </xsl:for-each>
      </xsl:variable>

      <!-- Open the container code -->
      <xsl:element name="div">
        <xsl:attribute name="class">EADRequest</xsl:attribute>

        <xsl:if test="$containerPosition = 1 or $topLevelRequestsOnly = false()">
          <xsl:element name="input">
            <xsl:attribute name="type">checkbox</xsl:attribute>
            <xsl:attribute name="name">Request</xsl:attribute>
            <xsl:attribute name="value">
              <xsl:value-of select="$containerIDString"/>
            </xsl:attribute>
            <xsl:attribute name="onclick">DoItemClick(this);</xsl:attribute>
          </xsl:element>
          <xsl:text> </xsl:text>
        </xsl:if>


        <xsl:value-of select="concat($containerTypeOutput, ': ', $containerNumber)"/>

        <xsl:element name="input">
          <xsl:attribute name="type">hidden</xsl:attribute>

          <!-- Map the container values to the Sublocation field in order to have the DLL group them into box-level containers if GroupRequestsByLocation key is set to "on" -->
          <xsl:attribute name="id">
            SubLocation_<xsl:value-of select="$containerIDString"/>
          </xsl:attribute>
          <xsl:attribute name="name">
            <xsl:value-of select="$containerIDString"/>
          </xsl:attribute>
          <xsl:attribute name="value">
            <xsl:value-of select="$containerSubLocation"/>
          </xsl:attribute>
        </xsl:element>
        <xsl:element name="div">
          <xsl:attribute name="id">
            <xsl:value-of select="concat('EADGroup', $containerIDString)"/>
          </xsl:attribute>
          <xsl:attribute name="class">EADContainer</xsl:attribute>
          <!-- Process inner containers -->
          <xsl:call-template name="processItemGroup">
            <xsl:with-param name="itemComponentList" select="$itemGroup"/>
            <xsl:with-param name="seriesID" select="$seriesID"/>
            <xsl:with-param name="containerPosition" select="number($containerPosition) + number(1)"/>
            <xsl:with-param name="itemIDStart" select="$itemIDStart"/>
          </xsl:call-template>
        </xsl:element>
      </xsl:element>
      <!-- Close the container -->
    </xsl:if>


    <!-- Process other containers-->
    <xsl:if test="count($itemsRemainingToBeGrouped) > 0">
      <xsl:call-template name="processItemGroup">
        <xsl:with-param name="itemComponentList" select="$itemsRemainingToBeGrouped"/>
        <xsl:with-param name="containerPosition" select="$containerPosition"/>
        <xsl:with-param name="seriesID" select="$seriesID"/>
        <xsl:with-param name="itemIDStart" select="number($itemIDStart) + count($itemGroup)"/>
      </xsl:call-template>
    </xsl:if>

    <xsl:variable name="itemIDStartAfterGroups" select="number(number($itemIDStart) + count($itemGroup) + count($itemsRemainingToBeGrouped))"/>

    <xsl:for-each select="$floatingItems">
      <xsl:call-template name="outputItem">
        <xsl:with-param name="itemNode" select="current()"/>
        <xsl:with-param name="itemID" select="concat(concat($seriesID, 'Item'), (number($itemIDStartAfterGroups) + position() - 1))"/>
      </xsl:call-template>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="outputItem">
    <xsl:param name="itemNode"/>
    <xsl:param name="itemID"/>

    <xsl:variable name="itemLocation">
      <xsl:for-each select="$itemNode/did/container">
        <xsl:value-of select="concat(translate(substring(@type, 1,1), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), translate(substring(@type, 2), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))"/>
        <xsl:text>: </xsl:text>
        <xsl:value-of select="."/>
        <xsl:if test="position() != last()">
          <xsl:text>; </xsl:text>
        </xsl:if>
      </xsl:for-each>
    </xsl:variable>

    <xsl:if test="$topLevelRequestsOnly = false() or not(did/container and did/container/@type and did/container[@type != ''])">
      <xsl:element name="input">
        <xsl:attribute name="type">checkbox</xsl:attribute>
        <xsl:attribute name="name">Request</xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="onclick">
          DoItemClick(this);
        </xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">
          ItemSubTitle_<xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:choose>
            <xsl:when test="did/unittitle">

              <xsl:value-of select="normalize-space(did/unittitle)"/>
            </xsl:when>
            <xsl:when test="did/head">
              <xsl:value-of select="normalize-space(did/head)"/>
            </xsl:when>
            <xsl:when test="head">
              <xsl:value-of select="normalize-space(head)"/>
            </xsl:when>
            <xsl:otherwise>
              Unspecified
            </xsl:otherwise>
          </xsl:choose>
        </xsl:attribute>

        <xsl:if test="$itemNode/did/container[@type != '']">
          <xsl:element name="input">
            <xsl:attribute name="type">hidden</xsl:attribute>

            <!-- Map the container values to the Sublocation field in order to have the DLL group them into box-level containers if GroupRequestsByLocation key is set to "on" -->
            <xsl:attribute name="id">
              SubLocation_<xsl:value-of select="$itemID"/>
            </xsl:attribute>
            <xsl:attribute name="name">
              <xsl:value-of select="$itemID"/>
            </xsl:attribute>
            <xsl:attribute name="value">
              <xsl:value-of select="translate($itemLocation, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
            </xsl:attribute>
          </xsl:element>
        </xsl:if>
      </xsl:element>
      <!-- Mapping of other field elements, if desired -->
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">
          ItemAuthor_<xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="did/author"/>
        </xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">
          ItemDate_<xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="did/date"/>
        </xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">
          ItemCitation_<xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="did/citation"/>
        </xsl:attribute>
      </xsl:element>
      <xsl:element name="input">
        <xsl:attribute name="type">hidden</xsl:attribute>
        <xsl:attribute name="id">
          ItemNumber_<xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="$itemID"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="did/number"/>
        </xsl:attribute>
      </xsl:element>
      <xsl:text> </xsl:text>
    </xsl:if>
    <!-- Display the title and date of the item -->
    <xsl:value-of select="did/unittitle"/>

    <xsl:if test="did/unitdate and did/unitdate != ''">
      <xsl:text>; </xsl:text>

      <xsl:value-of select="did/unitdate"/>
    </xsl:if>
    <xsl:text> </xsl:text>
    <xsl:if test="$itemNode/did/container[@type != '']">
      <xsl:value-of select="concat('[', $itemLocation, ']')"/>
    </xsl:if>

    <xsl:if test="position() != last()">
      <br/>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>